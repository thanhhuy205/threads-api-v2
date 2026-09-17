-- Encodes the verified JWT claims into the X-JWT-CLAIMS header for upstream
-- services. Runs at priority 1000, i.e. AFTER the bundled `jwt` plugin
-- (priority 1450) has already verified the signature and the `exp` claim, so
-- the payload is decoded here without re-verifying it.
--
-- Requests that carry no valid token (the anonymous consumer) get "{}", and the
-- app layer decides whether that is acceptable via @IsPublic().

local cjson = require "cjson.safe"

local AuthContext = {
  VERSION = "1.0.0",
  PRIORITY = 1000,
}

local CLAIMS_HEADER = "X-JWT-CLAIMS"

-- base64url -> Lua string
local function decode_base64url(input)
  local normalized = input:gsub("-", "+"):gsub("_", "/")

  local padding = #normalized % 4
  if padding == 2 then
    normalized = normalized .. "=="
  elseif padding == 3 then
    normalized = normalized .. "="
  elseif padding == 1 then
    return nil
  end

  return ngx.decode_base64(normalized)
 end

local function retrieve_token()
  local authorization = kong.request.get_header("authorization")
  if authorization then
    local token = authorization:match("^[Bb]earer%s+(.+)$")
    if token then
      return token
    end
  end

  -- mirrors the jwt plugin's `uri_param_names: [jwt]`
  return kong.request.get_query_arg("jwt")
end

local function decode_payload(token)
  local encoded_payload = token:match("^[^.]+%.([^.]+)%.")
  if not encoded_payload then
    return nil
  end

  local decoded = decode_base64url(encoded_payload)
  if not decoded then
    return nil
  end

  return cjson.decode(decoded)
end

function AuthContext:access(config)
  -- Never trust a client-supplied value: the upstream services treat this
  -- header as authenticated identity, so an inbound one must be dropped
  -- before we set our own.
  kong.service.request.clear_header(CLAIMS_HEADER)

  local token = retrieve_token()
  if not token then
    kong.service.request.set_header(CLAIMS_HEADER, "{}")
    return
  end

  local payload = decode_payload(token)
  if type(payload) ~= "table" then
    kong.service.request.set_header(CLAIMS_HEADER, "{}")
    return
  end

  local claims = {
    id = payload.sub,
    email = payload.email,
    type = payload.type,
    role = payload.role,
    jti = payload.jti,
    key = payload.key,
  }

  local encoded, err = cjson.encode(claims)
  if not encoded then
    kong.log.err("auth-context: failed to encode claims: ", err)
    kong.service.request.set_header(CLAIMS_HEADER, "{}")
    return
  end

  kong.service.request.set_header(CLAIMS_HEADER, encoded)
end

return AuthContext

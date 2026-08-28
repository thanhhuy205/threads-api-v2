local cjson = require "cjson.safe"

local AuthContext = {
  VERSION = "1.0.0",
  PRIORITY = 1000,
}

function AuthContext:access(config)
  local payload, err =
    kong.client.get_jwt_token_payload()

  if not payload then
    kong.service.request.set_header(
      "X-JWT-CLAIMS",
      "{}"
    )
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

  kong.service.request.set_header(
    "X-JWT-CLAIMS",
    cjson.encode(claims)
  )
end

return AuthContext
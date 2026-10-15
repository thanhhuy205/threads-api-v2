import assert from "node:assert/strict";
import test from "node:test";

const apisixUrl = process.env.APISIX_URL ?? "http://localhost:9080";
const apiPrefix = process.env.ACCOUNT_SERVICE_API_PREFIX ?? "/api/v1/auth";
const accessToken = process.env.TEST_ACCESS_TOKEN ?? "eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJjMTIwODlmYS02OTk0LTRkNTctOTU4Ny02YmY3YmJkNjdjZDgifQ.eyJleHAiOjE3OTIxMTMwMjIsImlhdCI6MTc5MjA3NzAyMiwianRpIjoiN2RmNDcyOGQtZGRlNS1jNWM2LTM4MGYtMzc1MjU5ZTVlZmM2IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDoxODA4MS9yZWFsbXMvcHVyc2UtYm9hcmQiLCJzdWIiOiJmOWMzNzZiMy00Y2UxLTQ4NDktYTYxZC04ZjgxMDcyOWQxOGUiLCJ0eXAiOiJTZXJpYWxpemVkLUlEIiwic2lkIjoiMC1Id21UQ1VjTjdvRWhKQkVuYjFNc0czIiwic3RhdGVfY2hlY2tlciI6InI2YmZ5SGlmZU9CeU1VSTRwdFhsTzhSQnMwZzFSMXNiaGxlNGptQ1pLakEifQ.Cz9qRW_N7miSdheIoqccb81RQr7WZz08JxxxOdW9lOu7V894zgZBXkoITiVf20hxY_KCp_hmjHyUt0j9796ilA";

type ApiResponse<T> = { statusCode: number; data: T };
type Organization = { id: string };
type Team = { id: string };

async function readJson<T>(response: Response, context: string): Promise<T> {
  const body = await response.text();
  if (!response.ok)
    throw new Error(`${context} failed with HTTP ${response.status}: ${body}`);
  try {
    return JSON.parse(body) as T;
  } catch {
    throw new Error(`${context} returned invalid JSON: ${body}`);
  }
}

async function getFromApisix<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(new URL(path, apisixUrl), {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${accessToken}`,
    },
    signal: AbortSignal.timeout(15_000),
  });
  return readJson<T>(response, `GET ${path} through APISIX`);
}

test(
  "uses an access token from the UI to call organizations and teams through APISIX",
  async () => {
    assert.ok(
      accessToken,
      "Set TEST_ACCESS_TOKEN to the access token returned after logging in through the UI.",
    );
    const organizationsResponse = await getFromApisix<
      ApiResponse<Organization[]>
    >(`${apiPrefix}/organizations?first=0&max=20`, accessToken);
    assert.equal(organizationsResponse.statusCode, 200);
    assert.ok(Array.isArray(organizationsResponse.data));
    assert.ok(
      organizationsResponse.data.length > 0,
      "Expected at least one organization.",
    );
    const organization = organizationsResponse.data[0];
    assert.equal(typeof organization.id, "string");
    assert.ok(organization.id.length > 0, "Expected organization ID.");

    const teamsResponse = await getFromApisix<ApiResponse<Team[]>>(
      `${apiPrefix}/organizations/${encodeURIComponent(organization.id)}/teams?first=0&max=20`,
      accessToken,
    );
    assert.equal(teamsResponse.statusCode, 200);
    assert.ok(Array.isArray(teamsResponse.data));
  },
);

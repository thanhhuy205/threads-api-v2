import test from 'node:test';

const kongUrl = process.env.KONG_URL ?? 'http://localhost:8100';
const runId = Date.now().toString(36);
const username = process.env.TEST_REGISTER_USERNAME ?? `auth_${runId}`;
const email = process.env.TEST_REGISTER_EMAIL ?? `auth_${runId}@example.com`;
const password = process.env.TEST_REGISTER_PASSWORD ?? 'password123';

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === 'object'
    ? value as Record<string, unknown>
    : undefined;

async function readBody(response: Response): Promise<unknown> {
  const rawBody = await response.text();

  try {
    return rawBody ? JSON.parse(rawBody) : null;
  } catch {
    return rawBody;
  }
}

function logResponse(response: Response, body: unknown): void {
  console.log(
    JSON.stringify(
      {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body,
      },
      null,
      2,
    ),
  );
}

test('registers and gets the authenticated user through Kong', async () => {
  const registerUrl = new URL('/api/v1/auth/register', kongUrl);
  const registerPayload = {
    username,
    email,
    password,
    confirmPassword: password,
  };

  console.log('\n[Kong auth integration test: register]');
  console.log(`POST ${registerUrl}`);
  console.log(
    JSON.stringify(
      {
        ...registerPayload,
        password: '[REDACTED]',
        confirmPassword: '[REDACTED]',
      },
      null,
      2,
    ),
  );

  const registerResponse = await fetch(registerUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(registerPayload),
    signal: AbortSignal.timeout(10_000),
  });

  const registerBody = await readBody(registerResponse);
  logResponse(registerResponse, registerBody);

  if (registerResponse.status !== 201) {
    throw new Error(`Register expected HTTP 201, received ${registerResponse.status}`);
  }

  const registerBodyRecord = asRecord(registerBody);
  const registerData = asRecord(registerBodyRecord?.data);
  const accessToken = registerBodyRecord?.accessToken ?? registerData?.accessToken;

  if (typeof accessToken !== 'string' || accessToken.length === 0) {
    throw new Error('Register response does not contain an accessToken');
  }

  const meUrl = new URL('/api/v1/auth/me', kongUrl);
  console.log('\n[Kong auth integration test: get me]');
  console.log(`GET ${meUrl}`);

  const meResponse = await fetch(meUrl, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    signal: AbortSignal.timeout(10_000),
  });
  const meBody = await readBody(meResponse);
  logResponse(meResponse, meBody);

  if (meResponse.status !== 200) {
    throw new Error(`Get me expected HTTP 200, received ${meResponse.status}`);
  }
});

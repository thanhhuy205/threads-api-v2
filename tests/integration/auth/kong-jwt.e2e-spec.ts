import test from 'node:test';

const kongUrl = process.env.KONG_URL ?? 'http://localhost:8100';
const login = process.env.TEST_AUTH_LOGIN ?? 'test@example.com';
const password = process.env.TEST_AUTH_PASSWORD ?? 'password123';

test('POST /auth-service/auth/login through Kong', async () => {
  const url = new URL('/auth-service/auth/login', kongUrl);

  console.log('\n[Kong auth integration test]');
  console.log(`POST ${url}`);
  console.log(`login: ${login}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
    signal: AbortSignal.timeout(10_000),
  });

  const rawBody = await response.text();
  let body: unknown = rawBody;

  try {
    body = JSON.parse(rawBody);
  } catch {
    // Keep a non-JSON response as text so Kong/upstream errors are still visible.
  }

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

  if ([502, 503, 504].includes(response.status)) {
    throw new Error(`Kong could not reach auth-service (HTTP ${response.status})`);
  }
});

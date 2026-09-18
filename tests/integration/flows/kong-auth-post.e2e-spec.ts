import test from 'node:test';

const kongUrl = process.env.KONG_URL ?? 'http://localhost:8100';
const runId = Date.now().toString(36);
const username = process.env.TEST_REGISTER_USERNAME ?? `test_${runId}`;
const email = process.env.TEST_REGISTER_EMAIL ?? `test_${runId}@example.com`;
const password = process.env.TEST_REGISTER_PASSWORD ?? 'password123';
const postContent = process.env.TEST_POST_CONTENT ?? `Integration test post ${runId}`;

type ApiResult = {
  status: number;
  body: unknown;
};

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === 'object'
    ? value as Record<string, unknown>
    : undefined;

async function callApi(
  label: string,
  path: string,
  init: RequestInit,
): Promise<ApiResult> {
  const url = new URL(path, kongUrl);

  console.log(`\n[Kong auth → post flow: ${label}]`);
  console.log(`${init.method ?? 'GET'} ${url}`);

  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(15_000),
  });
  const rawBody = await response.text();
  let body: unknown = rawBody;

  try {
    body = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    // Preserve non-JSON gateway/upstream responses for debugging.
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

  return { status: response.status, body };
}

function expectStatus(result: ApiResult, expected: number, step: string): void {
  if (result.status !== expected) {
    throw new Error(`${step}: expected HTTP ${expected}, received ${result.status}`);
  }
}

test('registers, creates a post, gets news feed and gets posts by user through Kong', async () => {
  const registerPayload = {
    username,
    email,
    password,
    confirmPassword: password,
  };

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

  const registerResult = await callApi('register', '/api/v1/auth/register', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(registerPayload),
  });
  expectStatus(registerResult, 201, 'register');

  const registerBody = asRecord(registerResult.body);
  const registerData = asRecord(registerBody?.data);
  const accessToken = registerBody?.accessToken ?? registerData?.accessToken;

  if (typeof accessToken !== 'string' || accessToken.length === 0) {
    throw new Error('register: response does not contain an accessToken');
  }

  const authenticatedHeaders = {
    accept: 'application/json',
    authorization: `Bearer ${accessToken}`,
  };

  const createPostResult = await callApi('create post', '/api/v1/posts', {
    method: 'POST',
    headers: {
      ...authenticatedHeaders,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ content: postContent }),
  });
  expectStatus(createPostResult, 201, 'create post');

  const newsFeedResult = await callApi('news feed', '/api/v1/posts/news-feed', {
    method: 'GET',
    headers: authenticatedHeaders,
  });
  expectStatus(newsFeedResult, 200, 'news feed');

  const postsByUserResult = await callApi(
    'posts by user',
    `/api/v1/posts/user/${encodeURIComponent(username)}`,
    {
      method: 'GET',
      headers: authenticatedHeaders,
    },
  );
  expectStatus(postsByUserResult, 200, 'posts by user');
});

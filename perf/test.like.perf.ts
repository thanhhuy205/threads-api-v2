import { check } from 'k6';
import { SharedArray } from 'k6/data';
import http from 'k6/http';
import { Options } from 'k6/options';

// import { randomUUID } from 'node:crypto';
// import { readFile, writeFile } from 'node:fs/promises';
// import path from 'node:path';
// import process from 'node:process';
// import { jwtService } from '../src/modules/jwt/service/jwt.service';


// async function readFileContent() {
//     const absolutePath = path.resolve(process.cwd(), 'perf', 'user-test', 'ids.json');
//     const outputPath = path.resolve(process.cwd(), 'perf', 'user-test', 'token.json');
//     const content = await readFile(absolutePath, 'utf-8');
//     const tokenTest = [];
//     const ids = JSON.parse(content);
//     console.log(ids);
//     for (const i of ids) {
//         let token = await jwtService.signAccessToken({
//             userId: i,
//             status: 'ACTIVE',
//             sessionId: randomUUID(),
//             roles: ['USER']
//         })
//         tokenTest.push(token)
//     };

//     await writeFile(outputPath, JSON.stringify(tokenTest));
// }

// readFileContent()

let cnt = 0;
const BASE_URL = 'http://localhost:3302/api/v1';
export const options: Options = {
    stages: [
        { duration: '30s', target: 100 },  // ramp up
        { duration: '1m', target: 200 },  // sustained load
        { duration: '30s', target: 0 },    // ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],  // ← đây là số đẹp
        http_req_failed: ['rate<0.01'],  // ← 99% success
    },
}
const tokens = new SharedArray('tokens', function () {
    return JSON.parse(open('./user-test/token.json'));
});

export default async function () {
    const token = tokens[cnt];

    const payload = JSON.stringify({
        isLiked: true
    });

    const res = http.post(
        `${BASE_URL}/posts/cmrafvunt006ks0tkri9nlgoj/like`,
        payload,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );

    cnt++;
    check(res, {
        'status 200 or 201': (r) => r.status === 200 || r.status === 201,
        'has like': (r) => {
            if (res.status !== 200 && res.status !== 201) {
                console.log(`FAIL - status=${res.status} body=${res.body}`)
            }
            try {
                const body = JSON.parse(r.body as string);
                return body.liked > 0;
            } catch {
                return false;
            }
        },
    });
}
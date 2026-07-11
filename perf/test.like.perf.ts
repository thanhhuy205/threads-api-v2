import { check } from 'k6';
import { SharedArray } from 'k6/data';
import http from 'k6/http';

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

const BASE_URL = 'http://localhost:3302/api/v1';
export const options = {
    vus: 200,
    iterations: 200,
};
const tokens = new SharedArray('tokens', function () {
    return JSON.parse(open('./user-test/token.json'));
});

export default async function () {
    const token = tokens[__VU - 1];

    const res = http.post(
        `${BASE_URL}/posts/cmrafvsbj0061s0tkw3is3tn0/like`,
        {},
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );

    check(res, {
        'status 200 or 201': (r) => r.status === 200 || r.status === 201,
        'has like': (r) => {
            if (res.status !== 200 && res.status !== 201) {
                console.log(`FAIL - status=${res.status} body=${res.body}`)
            }
            try {
                const body = JSON.parse(r.body as string);
                console.log(body);
                return body.data.liked > 0;
            } catch {
                return false;
            }
        },
    });
}
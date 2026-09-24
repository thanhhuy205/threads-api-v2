import { createRemoteJWKSet, JWTPayload, jwtVerify } from 'jose';

const issuer = 'http://localhost:18081/realms/pulseboard';

const jwks = createRemoteJWKSet(
    new URL(`${issuer}/protocol/openid-connect/certs`),
);

export const getPayloadJwtVerify = async (
  accessToken: string,
): Promise<JWTPayload> => {
    const { payload } = await jwtVerify(accessToken, jwks, {
        issuer,
        audience: 'pulseboard-api',
        algorithms: ['RS256'],
    });

    return payload;
}

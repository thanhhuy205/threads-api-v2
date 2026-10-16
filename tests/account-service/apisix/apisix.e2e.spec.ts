
import process from 'process';
import {
    DockerComposeEnvironment,
    type StartedDockerComposeEnvironment,
} from 'testcontainers'; // Import Compose support.
import { afterAll, beforeAll, describe, expect, it } from 'vitest'; // Import Vitest tools.

describe('APISIX E2E', () => { // Group the gateway tests.
    let environment: StartedDockerComposeEnvironment; // Store the test environment.
    let baseUrl: string; // Store the APISIX URL.

    beforeAll(async () => { // Start services before tests.
        environment = await new DockerComposeEnvironment(process.cwd(), [
            'deploy/compose/compose.yaml',
            'deploy/compose/overlays/test.yaml',
        ])
            .withEnvironmentFile('.env')
            .withProjectName('pulseboard-e2e')
            .up(['apisix']);

        const apisix = environment.getContainer('test-apisix'); // Get the APISIX container.
        baseUrl = `http://${apisix.getHost()}:${apisix.getMappedPort(9080)}`; // Find its host address.
    }, 180_000); // Allow three minutes for startup.

    afterAll(async () => { // Clean up after the tests.
        await environment?.down({ removeVolumes: false }); // Stop containers but keep volumes.
    }, 30_000); // Allow time for cleanup.

    it('routes requests to NestJS', async () => { // Test gateway routing.
        const response = await fetch(`${baseUrl}/health`); // Request a public health route.
        expect(response.status).toBe(200); // Expect a successful response.
    }); // End the routing test.

    it('rejects requests without tokens', async () => { // Test Keycloak authentication.
        const response = await fetch(`${baseUrl}/api/account/me`); // Call a protected route.
        expect(response.status).toBe(401); // Expect authentication to fail.
    }); // End the authentication test.
}); // End the test group.

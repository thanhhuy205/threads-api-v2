import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { NodeSDK } from '@opentelemetry/sdk-node';

export function startTracing() {
    const sdk = new NodeSDK({
        instrumentations: [
            new HttpInstrumentation(),
            new GrpcInstrumentation(),

            new PinoInstrumentation({
                disableLogSending: true,
                disableLogCorrelation: false,
            }),
        ],
    });

    sdk.start();

    process.once('SIGTERM', async () => {
        await sdk.shutdown();
    });

    return sdk;
}
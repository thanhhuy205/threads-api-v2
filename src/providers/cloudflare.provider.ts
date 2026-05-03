import configService from '@/config/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
    region: 'auto',
    endpoint: configService.R2_ENDPOINT,
    credentials: {
        accessKeyId: configService.R2_ACCESS_KEY_ID,
        secretAccessKey: configService.R2_SECRET_ACCESS_KEY,
    },
});

export const putObject = async (params: { key: string; body: Buffer; contentType: string }) => {
    await s3.send(
        new PutObjectCommand({
            Bucket: configService.R2_BUCKET_NAME,
            Key: params.key,
            Body: params.body,
            ContentType: params.contentType,
        }),
    );
    return { key: params.key };
}

export default s3;
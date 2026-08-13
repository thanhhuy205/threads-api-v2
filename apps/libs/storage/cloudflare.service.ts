import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readdir, readFile, rm } from "fs/promises";
import path from "path";

@Injectable()
export class CloudflareService {
    private s3: S3Client;
    constructor(private configService: ConfigService) {
        this.s3 = new S3Client({
            region: "auto",
            endpoint: this.configService.get("R2_CONFIG.S3_ENDPOINT")!,
            credentials: {
                accessKeyId: this.configService.get("R2_CONFIG.R2_ACCESS_KEY_ID")!,
                secretAccessKey: this.configService.get("R2_CONFIG.R2_SECRET_ACCESS_KEY")!,
            },
        });
    }

    putObject = async (params: { key: string; body: Buffer; contentType?: string }) => {
        await this.s3.send(
            new PutObjectCommand({
                Bucket: this.configService.get('R2_CONFIG.R2_BUCKET_NAME'),
                Key: params.key,
                Body: params.body,
                ContentType: params.contentType ?? 'image/webp',
            }),
        );
        return {
            key: params.key,
            url: `${this.configService.get('R2_CONFIG.R2_ENDPOINT')}/${this.configService.get('R2_CONFIG.R2_BUCKET_NAME')}/${params.key}`,
        };
    }

    getS3Client = () => {
        return this.s3;
    }

    async uploadDirectory(localDir: string, r2Dir: string): Promise<void> {
        const files = await readdir(localDir);

        for (const file of files) {
            const key = `${r2Dir}/${file}`;
            await this.putObject({
                key,
                body: await readFile(path.join(localDir, file)),
                contentType: file.endsWith('.m3u8')
                    ? 'application/x-mpegURL'
                    : 'video/MP2T',
            });
        }

        await rm(localDir, { recursive: true, force: true });
    }
}

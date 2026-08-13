import { CloudflareService } from "@libs/storage/cloudflare.service";
import { Module } from "@nestjs/common";

@Module({
    providers: [CloudflareService],
    exports: [CloudflareService],
})
export class CloudflareModule { }
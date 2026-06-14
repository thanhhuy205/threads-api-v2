import { putObject } from "@/providers/cloudflare.provider";
import { readdir, readFile } from "fs/promises";
export const generateKeyImage = (
    folder: string,
    fileName: string
): string => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const unique = crypto.randomUUID();
    return `${folder}/${year}/${month}/${unique}.webp`;
};

export const uploadDirToR2 = async (localDir: string, r2Dir: string) => {
    const files = await readdir(localDir);
    for (const file of files) {
        const filePath = `${localDir}/${file}`;

        const fileBuffer = await readFile(filePath);
        const key = `${r2Dir}/${file}`;
        await putObject({
            key,
            body: fileBuffer,
            contentType: file.endsWith('.m3u8')
                ? 'application/x-mpegURL'
                : 'video/MP2T',
        });
    }

}
import { baseLogger } from "@/middlewares/logger";
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";


const IMAGE_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
]);

export const handlerResize = async (buffer: Buffer) => {
    const metadata = await sharp(buffer).metadata();
    const { width: w, height: h } = metadata;
    const width = w ?? null;
    const height = h ?? null;

    const MAX_WIDTH = 1080;

    if ((width ?? 0) <= MAX_WIDTH && (height ?? 0) <= MAX_WIDTH) {
        return {
            buffer,
            width,
            height,
        };
    }

    const resizedBuffer = await sharp(buffer)
        .resize(MAX_WIDTH, MAX_WIDTH, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

    const resizedMetadata = await sharp(resizedBuffer).metadata();
    const resizedWidth = resizedMetadata.width ?? width;
    const resizedHeight = resizedMetadata.height ?? height;

    baseLogger.info(`Image resized from ${w}x${h} to fit within ${MAX_WIDTH}x${MAX_WIDTH}`);
    return {
        buffer: resizedBuffer,
        width: resizedWidth,
        height: resizedHeight,
    };
}

export const resizeForThreads = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
        const file = req.file;
        if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
            return file;
        }

        const buffer = req.file.buffer;
        const resized = await handlerResize(buffer);
        req.file.resizedBuffer = resized.buffer;
        req.file.width = resized.width ?? undefined;
        req.file.height = resized.height ?? undefined;
    }

    if (req.files) {
        const files = req.files as Express.Multer.File[];
        await Promise.all(files.map(async (file) => {
            if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
                return file;
            }
            const buffer = file.buffer;
            const resized = await handlerResize(buffer);
            file.resizedBuffer = resized.buffer;
            file.width = resized.width ?? undefined;
            file.height = resized.height ?? undefined;
        }));
    }

    next();
};
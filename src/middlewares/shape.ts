import { baseLogger } from "@/middlewares/logger";
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";




export const handlerResize = async (buffer: Buffer) => {
    const metadata = await sharp(buffer).metadata();
    const { width: w, height: h } = metadata;

    const MAX_WIDTH = 1080;

    if (w <= MAX_WIDTH && h <= MAX_WIDTH) {
        return buffer;
    }

    const resizedBuffer = await sharp(buffer)
        .resize(MAX_WIDTH, MAX_WIDTH, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

    baseLogger.info(`Image resized from ${w}x${h} to fit within ${MAX_WIDTH}x${MAX_WIDTH}`);
    return resizedBuffer;
}

export const resizeForThreads = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
        const buffer = req.file.buffer;
        const resizedBuffer = await handlerResize(buffer);
        req.file.resizedBuffer = resizedBuffer;
    }

    if (req.files) {
        const files = req.files as Express.Multer.File[];
        await Promise.all(files.map(async (file) => {
            const buffer = file.buffer;
            const resizedBuffer = await handlerResize(buffer);
            file.resizedBuffer = resizedBuffer;
        }));
    }

    next();
};
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

export const resizeForThreads = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    const buffer = req.file.buffer;
    const metadata = await sharp(buffer).metadata();
    const { width: w, height: h } = metadata;

    const MAX_WIDTH = 1080;

    if (w <= MAX_WIDTH && h <= MAX_WIDTH) {
        req.file.resizedBuffer = buffer;
        return next();
    }

    const resizedBuffer = await sharp(buffer)
        .resize(MAX_WIDTH, MAX_WIDTH, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

    req.file.resizedBuffer = resizedBuffer;
    next();
};
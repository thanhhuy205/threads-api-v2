import { Logger } from '@nestjs/common';
import sharp from 'sharp';

const logger = new Logger('ImageResize', { timestamp: true });
const MAX_WIDTH = 1080;

export const resizeImage = async (buffer: Buffer) => {
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width ?? null;
  const height = metadata.height ?? null;

  if ((width ?? 0) <= MAX_WIDTH && (height ?? 0) <= MAX_WIDTH) {
    return { buffer, width, height };
  }

  const resizedBuffer = await sharp(buffer)
    .resize(MAX_WIDTH, MAX_WIDTH, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  const resizedMetadata = await sharp(resizedBuffer).metadata();

  logger.log(`Image resized from ${metadata.width}x${metadata.height} to fit within ${MAX_WIDTH}x${MAX_WIDTH}`);
  return {
    buffer: resizedBuffer,
    width: resizedMetadata.width ?? width,
    height: resizedMetadata.height ?? height,
  };
};

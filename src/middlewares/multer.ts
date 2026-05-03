import configService from '@/config/config';
import { generateKeyImage } from '@/util/upload.util';
import { Request } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../providers/cloudflare.provider';

export const upload = multer({
    storage: multerS3({
        s3,
        bucket: configService.R2_BUCKET_NAME, // Tên bucket của bạn
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const folder = file.mimetype.startsWith('image/') ? 'images' : 'videos';

            const key = generateKeyImage(folder, file.originalname);
            cb(null, key);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req: Request, file: Express.Multer.File, cb: (error: any, acceptFile: boolean) => void) => {
        if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
            return cb(new Error('Chỉ cho phép file ảnh hoặc video!'), false);
        }
        cb(null, true);
    },
});

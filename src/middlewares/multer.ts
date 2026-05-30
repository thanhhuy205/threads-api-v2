import multer from 'multer';


export const memoryUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB file gốc
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
            return cb(new Error('Chỉ cho phép file ảnh hoặc video') as any, false);
        }
        (cb as any)(null, true);
    },
});




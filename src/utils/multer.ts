import { Request } from 'express';
import multer from 'multer';

const maxFileSize = 5000 * 1024 * 1024 // 5GB

//Config Multer
// const storage = multer.diskStorage({
//     destination: (_req: Request, _file, cb) => {
//         cb(null, "public/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },

// });

const storage = multer.memoryStorage(); // Store files in memory for direct upload to Wasabi

const upload = multer({ storage, limits: {
    fileSize: maxFileSize
}});


export default upload;
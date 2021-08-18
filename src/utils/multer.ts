import { Request } from 'express';
import multer from 'multer';

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req: Request, file, cb: CallableFunction) => {
    if (file.mimetype === 'audio/mp3') {
      cb(null, true);
    } else if (file.mimetype === 'image/jpeg' || 'image/jpg' || 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('File type is not supported'), false);
    }
  },
});

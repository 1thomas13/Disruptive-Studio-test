import multer, { FileFilterCallback } from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/images/');
    } else {
      cb(null, 'uploads/files/');  // Carpeta separada para otros archivos
    }
  },
  filename: (_, file: Express.Multer.File, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req: any, file: any, callback: multer.FileFilterCallback) => {
  callback(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } 
});

export default upload;

import { Content } from "../models";
import multer from 'multer'

function isImageUrl(url: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = url.split('.').pop()?.toLowerCase();
  return extension ? imageExtensions.includes(extension) : false;
}

export const getCountsForCategory = async (category?: string)  =>{
  try {
    let contents;

    if (category) {
      contents = await Content.find({ category });
    } else {
      contents = await Content.find({});
    }

    let imagesCount = 0;
    let linksCount = 0;
    let filesCount = 0;

    contents.forEach(content => {
      content.urls.forEach(url => {
        if (isImageUrl(url)) {
          imagesCount++;
        } else {
          linksCount++;
        }
      });

      filesCount += content.files.length;
    });

    return {
      imagesCount,
      linksCount,
      filesCount,
    };
  } catch (error) {
    console.error('Error fetching counts:', error);
    return {
      imagesCount: 0,
      linksCount: 0,
      filesCount: 0,
    };
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/images/');
    } else {
      cb(null, 'uploads/files/'); 
    }
  },
  filename: (_, file: Express.Multer.File, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (_: any, __: any, callback: multer.FileFilterCallback) => {
  callback(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } 
});

export default upload;

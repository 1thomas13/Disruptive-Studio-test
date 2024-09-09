"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCountsForCategory = void 0;
const models_1 = require("../models");
const multer_1 = __importDefault(require("multer"));
function isImageUrl(url) {
    var _a;
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = (_a = url.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    return extension ? imageExtensions.includes(extension) : false;
}
const getCountsForCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let contents;
        if (category) {
            contents = yield models_1.Content.find({ category });
        }
        else {
            contents = yield models_1.Content.find({});
        }
        let imagesCount = 0;
        let linksCount = 0;
        let filesCount = 0;
        contents.forEach(content => {
            content.urls.forEach(url => {
                if (isImageUrl(url)) {
                    imagesCount++;
                }
                else {
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
    }
    catch (error) {
        console.error('Error fetching counts:', error);
        return {
            imagesCount: 0,
            linksCount: 0,
            filesCount: 0,
        };
    }
});
exports.getCountsForCategory = getCountsForCategory;
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, 'uploads/images/');
        }
        else {
            cb(null, 'uploads/files/');
        }
    },
    filename: (_, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const fileFilter = (_, __, callback) => {
    callback(null, true);
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
});
exports.default = upload;

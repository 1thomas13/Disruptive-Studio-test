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
const express_1 = __importDefault(require("express"));
const index_1 = require("../models/index");
const middlewares_1 = require("../middlewares");
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
router.post('/', (0, middlewares_1.authenticateUser)(['admin']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, isUrl, isImage, isDocument, fileExtension, domain } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }
        const existingContentType = yield index_1.ContentType.findOne({ name });
        if (existingContentType)
            return res.status(400).json({ message: 'Content type already exists.' });
        const contentType = yield index_1.ContentType.create({ name, description, isUrl, isImage, isDocument, fileExtension, domain });
        res.status(201).json(contentType);
    }
    catch (error) {
        if (req.file && req.file.path)
            fs_1.default.unlinkSync(req.file.path);
        res.status(500).json({ message: error.message });
    }
}));
router.get('/', (0, middlewares_1.authenticateUser)(['admin', 'creator', 'user']), (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contentTypes = yield index_1.ContentType.find({});
        res.status(200).json(contentTypes);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;

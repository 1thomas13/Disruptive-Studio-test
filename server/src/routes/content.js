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
const middlewares_1 = require("../middlewares");
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const helpers_1 = __importDefault(require("../helpers"));
const router = express_1.default.Router();
router.post('/', (0, middlewares_1.authenticateUser)(['admin', 'creator']), helpers_1.default.fields([
    { name: 'files', maxCount: 10 }
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, category, creator } = req.body;
        const files = req.files['files'] || [];
        if (!name || !category || !creator)
            return res.status(400).json({ message: 'Missing required fields' });
        let urls = [];
        if (typeof req.body.urls === 'string') {
            try {
                urls = JSON.parse(req.body.urls);
            }
            catch (error) {
                return res.status(400).json({ message: 'Invalid URL format' });
            }
        }
        const categoryDoc = yield models_1.Category.findById(category).exec();
        if (!categoryDoc)
            return res.status(400).json({ message: 'Invalid category' });
        const filePaths = files.map(file => file.path);
        const content = new models_1.Content({ name, description, urls, files: filePaths, category, creator });
        yield content.save();
        res.status(201).json({ content });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contents = yield models_1.Content.find()
            .populate({
            path: 'category',
            select: 'name imageUrl'
        })
            .populate({
            path: 'creator',
            select: 'username'
        })
            .select('name category creator');
        res.status(200).json(contents);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('/:id', (0, middlewares_1.authenticateUser)(['admin', 'creator', 'user']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const content = yield models_1.Content.findById(req.params.id)
            .populate('category', 'name imageUrl')
            .populate('creator', 'username');
        if (!content)
            return res.status(404).json({ message: 'Content not found' });
        res.status(200).json(content);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;

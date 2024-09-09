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
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const helpers_1 = __importDefault(require("../helpers"));
const router = express_1.default.Router();
router.use((0, middlewares_1.authenticateUser)(['admin']));
router.get('/:id/content-types', (0, middlewares_1.authenticateUser)(['admin', 'creator']), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield index_1.Category.findById(req.params.id).populate('contentTypes');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category.contentTypes);
    }
    catch (error) {
        console.error('Error fetching content types:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
router.post('/', (0, middlewares_1.authenticateUser)(['admin']), helpers_1.default.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, contentTypes } = req.body;
        const image = req.file ? req.file.path : null;
        const contentTypeArray = Array.isArray(contentTypes) ? contentTypes : JSON.parse(contentTypes);
        const validContentTypes = contentTypeArray.every((id) => mongoose_1.default.Types.ObjectId.isValid(id)) ? contentTypeArray : [];
        if (!name || !description || !validContentTypes.length || !image) {
            if (image)
                fs_1.default.unlinkSync(image);
            return res.status(400).json({ message: 'Please provide all required fields and valid contentTypes.' });
        }
        const existingCategory = yield index_1.Category.findOne({ name });
        if (existingCategory) {
            if (image)
                fs_1.default.unlinkSync(image);
            return res.status(400).json({ message: 'Category already exists' });
        }
        const category = yield index_1.Category.create({ name, description, contentTypes: validContentTypes, imageUrl: image });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
router.get('', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield index_1.Category.find({});
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;

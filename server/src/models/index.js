"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = exports.ContentType = exports.Category = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'creator'], default: 'user' }
});
exports.User = mongoose_1.default.model('User', userSchema);
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
    },
    contentTypes: [{
            type: Schema.Types.ObjectId,
            ref: 'ContentType',
        }],
    imageUrl: {
        type: String,
        required: true,
    },
});
exports.Category = mongoose_1.default.model('Category', categorySchema);
const contentTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    isUrl: {
        type: Boolean,
        default: false,
    },
    isImage: {
        type: Boolean,
        default: false,
    },
    isDocument: {
        type: Boolean,
        default: false,
    },
    fileExtension: {
        type: String,
        default: null,
    },
    domain: {
        type: String,
        default: null,
    },
});
exports.ContentType = mongoose_1.default.model('ContentType', contentTypeSchema);
const contentSchema = new Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    urls: [String],
    files: [String],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    },
});
exports.Content = mongoose_1.default.model('Content', contentSchema);

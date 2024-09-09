import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'creator'], default: 'user' }
});

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'creator';
}

export const User = mongoose.model('User', userSchema);

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

export const Category = mongoose.model('Category', categorySchema);

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

export const ContentType = mongoose.model('ContentType', contentTypeSchema);

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

export const Content = mongoose.model('Content', contentSchema)






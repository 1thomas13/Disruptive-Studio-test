import express from 'express';
import { Category, Content } from '../models/index';
import { ContentType } from '../models/index';
import { authenticateUser } from '../middlewares';
import upload from '../utils';
import mongoose from 'mongoose';
import fs from 'fs';

const router = express.Router();

router.use(authenticateUser(['admin']));

router.post('/categories', upload.single('image'), async (req, res) => {
  try {
    const { name, description, contentTypes } = req.body;
    const image = req.file ? req.file.path : null;

    const contentTypeArray = Array.isArray(contentTypes) ? contentTypes : JSON.parse(contentTypes);

    const validContentTypes = contentTypeArray.every((id: string) => mongoose.Types.ObjectId.isValid(id)) ? contentTypeArray : [];

    if (!name || !description || !validContentTypes.length || !image) {
      if (image) fs.unlinkSync(image);
      return res.status(400).json({ message: 'Please provide all required fields and valid contentTypes.' });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      if (image) fs.unlinkSync(image);
      return res.status(400).json({ message: 'Category already exists' })
    }

    const category = await Category.create({ name, description, contentTypes: validContentTypes, imageUrl: image });
    res.status(201).json(category);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/content-types', async (req, res) => {
  try {
    const { name, description, isUrl, isImage, isDocument, fileExtension, domain } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const existingContentType = await ContentType.findOne({ name });
    if (existingContentType) return res.status(400).json({ message: 'Content type already exists.' });
    

    const contentType = await ContentType.create({ name, description, isUrl, isImage, isDocument, fileExtension, domain });
    res.status(201).json(contentType);
  } catch (error: any) {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path); 
    res.status(500).json({ message: error.message });
  }
});

router.get('/content-types', async (_, res) => {
  try {
    const contentTypes = await ContentType.find({});
    res.status(200).json(contentTypes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id/content-types', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('contentTypes');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category.contentTypes);
  } catch (error) {
    console.error('Error fetching content types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/contents', upload.fields([
  { name: 'files', maxCount: 10 }
]), async (req, res) => {
  try {
    const { name, description, category, creator } = req.body;
    const files = (req.files as { [fieldname: string]: Express.Multer.File[] })['files'] || [];
    
    if (!name || !category || !creator) return res.status(400).json({ message: 'Missing required fields' });

    let urls: string[] = [];
    if (typeof req.body.urls === 'string') {
      try {
        urls = JSON.parse(req.body.urls);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid URL format' });
      }
    }

    const categoryDoc = await Category.findById(category).exec();
    if (!categoryDoc) return res.status(400).json({ message: 'Invalid category' });

    const filePaths = (files as Express.Multer.File[]).map(file => file.path);

    const content = new Content({ name, description, urls, files: filePaths, category, creator });
    await content.save();

    res.status(201).json({ content });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/contents', upload.fields([
  { name: 'files', maxCount: 10 }
]), async (req, res) => {
  try {
    const { name, description, category, creator } = req.body;
    const files = (req.files as { [fieldname: string]: Express.Multer.File[] })['files'] || [];
    
    if (!name || !category || !creator) return res.status(400).json({ message: 'Missing required fields' });
    
    let urls: string[] = [];
    if (typeof req.body.urls === 'string') {
      try {
        urls = JSON.parse(req.body.urls);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid URL format' });
      }
    }

    const categoryDoc = await Category.findById(category).exec();
    if (!categoryDoc) return res.status(400).json({ message: 'Invalid category' });

    const filePaths = (files as Express.Multer.File[]).map(file => file.path);

    const content = new Content({ name, description, urls, files: filePaths, category, creator });
    await content.save();

    res.status(201).json({ content });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});



export default router;
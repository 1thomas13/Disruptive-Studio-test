import express from 'express';
import { Category, Content } from '../models/index';
import { authenticateUser } from '../middlewares';
import mongoose from 'mongoose';
import fs from 'fs';
import upload from '../helpers';

const router = express.Router();
router.use(authenticateUser(['admin']));

router.get('/:id/content-types', authenticateUser(['admin', 'creator']), async (req, res) => {
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

router.post('/', authenticateUser(['admin']), upload.single('image'), async (req, res) => {
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

router.get('', async (_, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
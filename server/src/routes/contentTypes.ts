import express from 'express';
import { ContentType } from '../models/index';
import { authenticateUser } from '../middlewares';
import fs from 'fs';

const router = express.Router();

router.post('/', authenticateUser(['admin']), async (req, res) => {
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

router.get('/', authenticateUser(['admin', 'creator', 'user']),async (_, res) => {
  try {
    const contentTypes = await ContentType.find({});
    res.status(200).json(contentTypes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
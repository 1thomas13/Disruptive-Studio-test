import { authenticateUser } from "../middlewares";
import express from 'express';
import { Category, Content } from "../models";
import upload from "../helpers";
const router = express.Router();

router.post('/', authenticateUser(['admin', 'creator']), upload.fields([
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

router.get('/', async (req, res) => {
  try {
    const contents = await Content.find()
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', authenticateUser(['admin', 'creator', 'user']),async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('category', 'name imageUrl')
      .populate('creator', 'username');

    if (!content) return res.status(404).json({ message: 'Content not found' });

    res.status(200).json(content);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
})

export default router;
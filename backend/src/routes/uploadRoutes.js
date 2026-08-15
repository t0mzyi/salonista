import express from 'express';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload single image to Cloudinary
 * @access  Public
 */
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'No image file uploaded or upload failed.' });
    }

    return res.status(200).json({
      success: true,
      url: req.file.path,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error during image upload:', error);
    return res.status(500).json({ error: 'Internal server error while uploading image.' });
  }
});

/**
 * @route   POST /api/upload/multiple
 * @desc    Upload up to 5 images to Cloudinary
 * @access  Public
 */
router.post('/multiple', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded.' });
    }

    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      filename: file.filename,
      originalName: file.originalname
    }));

    return res.status(200).json({
      success: true,
      files: uploadedFiles,
      urls: uploadedFiles.map(f => f.url)
    });
  } catch (error) {
    console.error('Error during multiple image upload:', error);
    return res.status(500).json({ error: 'Internal server error while uploading images.' });
  }
});

export default router;

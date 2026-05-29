import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../cloudinary.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = Router();

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif, webp, svg) are allowed'));
    }
  }
});

// POST /api/upload - Upload image to Cloudinary (Admin only)
router.post('/', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const folder = req.body.folder || 'porwal-jewellers/products';

    // Upload to Cloudinary using buffer stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
            { width: 1200, height: 1200, crop: 'limit' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error('Image upload error:', error.message);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// POST /api/upload/multiple - Upload multiple images (Admin only)
router.post('/multiple', verifyAdmin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const folder = req.body.folder || 'porwal-jewellers/products';
    const uploadResults = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      uploadResults.push({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      });
    }

    res.json({ images: uploadResults });
  } catch (error) {
    console.error('Multiple image upload error:', error.message);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// DELETE /api/upload/:publicId - Delete image from Cloudinary (Admin only)
router.delete('/:publicId', verifyAdmin, async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ message: 'Image deleted', result });
  } catch (error) {
    console.error('Image delete error:', error.message);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;

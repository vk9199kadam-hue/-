import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Writable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloud-name' &&
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY !== 'your-api-key';

let cloudinaryInstance;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  cloudinaryInstance = cloudinary;
} else {
  console.warn('⚠️ Cloudinary config placeholders detected. Using local mock image uploads.');
  cloudinaryInstance = {
    uploader: {
      upload_stream: (options, callback) => {
        const chunks = [];
        const writable = new Writable({
          write(chunk, encoding, next) {
            chunks.push(chunk);
            next();
          }
        });
        writable.on('finish', () => {
          try {
            const buffer = Buffer.concat(chunks);
            const hash = crypto.createHash('md5').update(buffer).digest('hex');
            const ext = 'jpg';
            const filename = `${hash}.${ext}`;
            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }
            const filepath = path.join(uploadsDir, filename);
            fs.writeFileSync(filepath, buffer);

            const result = {
              secure_url: `http://localhost:${process.env.PORT || 5000}/uploads/${filename}`,
              public_id: filename.split('.')[0],
              width: 800,
              height: 800,
              format: ext
            };
            callback(null, result);
          } catch (err) {
            callback(err);
          }
        });
        return writable;
      },
      destroy: async (publicId) => {
        try {
          const uploadsDir = path.join(__dirname, '..', 'uploads');
          if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            const fileToDelete = files.find(f => f.startsWith(publicId));
            if (fileToDelete) {
              fs.unlinkSync(path.join(uploadsDir, fileToDelete));
            }
          }
          return { result: 'ok' };
        } catch (e) {
          console.error('Local file delete error:', e);
          return { result: 'failed' };
        }
      }
    }
  };
}

export default cloudinaryInstance;


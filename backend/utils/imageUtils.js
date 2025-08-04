import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Create folder if not exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const saveImage = (base64Data) => {
  const filename = `img-${Date.now()}.jpg`;
  const filePath = path.join(UPLOADS_DIR, filename);
  
  // Remove data URL prefix if exists
  const cleanData = base64Data.replace(/^data:image\/\w+;base64,/, '');
  
  fs.writeFileSync(filePath, cleanData, 'base64');
  return `/uploads/${filename}`;
};
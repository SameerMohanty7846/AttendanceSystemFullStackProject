import db from '../config/db.js';
import { saveImage } from '../utils/imageUtils.js';

export const checkIn = async (req, res) => {
  try {
    const { name, image } = req.body;
    const now = new Date();

    // Step 1: Check if the user has already checked in today
    const [existing] = await db.promise().query(
      `SELECT check_in_image_path FROM attendance 
       WHERE name = ? AND date = CURDATE()`,
      [name]
    );

    // Step 2: If check-in already exists, return the existing image
    if (existing.length) {
      return res.json({
        success: false,
        message: 'You have already checked in today.',
        imageUrl: existing[0].check_in_image_path
      });
    }

    // Step 3: Save image and insert new check-in record
    const imagePath = saveImage(image);

    await db.promise().query(
      `INSERT INTO attendance 
       (name, date, check_in_time, check_in_image_path) 
       VALUES (?, ?, ?, ?)`,
      [name, now, now, imagePath]
    );

    res.json({
      success: true,
      message: 'Check-in successful',
      imageUrl: imagePath
    });

  } catch (err) {
    console.error('Check-in error:', err.message);
    res.status(500).json({ error: 'Check-in failed' });
  }
};

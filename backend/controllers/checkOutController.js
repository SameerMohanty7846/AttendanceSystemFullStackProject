import db from '../config/db.js';
import { saveImage } from '../utils/imageUtils.js';

export const checkOut = async (req, res) => {
  try {
    const { name, image } = req.body;
    const now = new Date();

    // 🔧 Use promise wrapper for the query
    const [checkInRows] = await db.promise().query(
      `SELECT id, check_in_time FROM attendance 
       WHERE name = ? AND date = CURDATE() 
       AND check_out_time IS NULL 
       LIMIT 1`,
      [name]
    );

    if (!checkInRows.length) {
      return res.status(400).json({ error: 'No check-in found' });
    }

    const imagePath = saveImage(image);
    const checkInTime = new Date(checkInRows[0].check_in_time);
    const totalMinutes = Math.round((now - checkInTime) / (1000 * 60));

    await db.promise().query(
      `UPDATE attendance SET 
       check_out_time = ?, 
       check_out_image_path = ?,
       total_time = ?
       WHERE id = ?`,
      [now, imagePath, totalMinutes, checkInRows[0].id]
    );

    res.json({ 
      success: true,
      checkInTime,
      checkOutTime: now,
      totalMinutes 
    });

  } catch (err) {
    console.error('Check-out error:', err.message);
    res.status(500).json({ error: 'Check-out failed' });
  }
};

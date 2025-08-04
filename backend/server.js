import express from 'express';
import cors from 'cors';
import path from 'path';
import attendanceRoutes from './routes/attendanceRoutes.js';

const app = express();

// Middleware with increased payload limit (50MB)
app.use(cors());
app.use(express.json({ limit: '50mb' })); // <-- Add this limit
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes
app.use('/api', attendanceRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
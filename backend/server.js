import express from 'express';
import cors from 'cors';
import path from 'path';
// import attendanceRoutes from './routes/attendance.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Routes
// app.use('/api', attendanceRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
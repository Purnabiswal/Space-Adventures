import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import catalogRoutes from './routes/catalogRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import visaRoutes from './routes/visaRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import routesRoutes from './routes/routesRoutes.js';
import { errorHandler, notFound } from './middleware/error.js';
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'ANTARIKSH API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api', catalogRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/visas', visaRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/routes', routesRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log('ANTARIKSH API listening on http://localhost:' + PORT));
});

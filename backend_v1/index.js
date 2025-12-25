import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRouter.js';
import connectDB from './config/db.js'; 
import therapyRouter from './routes/therapyRouter.js';
import doctorRouter from './routes/doctorRouter.js';
import adminRouter from './routes/adminRouter.js';



dotenv.config();

-
connectDB(); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://project-x-kappa-ten.vercel.app' 
        
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Basic Route ---
app.get('/', (req, res) => {
    res.send('IndriyaX API Running!');
});

// --- API ROUTES ---
app.use('/api/v1/auth', authRouter); 
app.use('/api/v1/therapy', therapyRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/admin', adminRouter);

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});





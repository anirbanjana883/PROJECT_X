import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import logger from './utils/logger';

// --- IMPORT ROUTES ---
import authRouter from './routes/auth.routes';
import adminRouter from './routes/admin.routes';
import therapyRouter from './routes/therapy.routes';
import userRouter from './routes/user.routes';
import passport from './config/passport';


dotenv.config();


connectDB();

const app = express();


app.use(helmet()); 
app.use(cors({
    origin: [
        'http://localhost:5173', 
        // 'https://indriyax.vercel.app',
        'https://project-x-kappa-ten.vercel.app' 
    ],
    credentials: true // Allow cookies
}));
app.use(express.json({ limit: '10kb' })); 
app.use(cookieParser());

app.use(passport.initialize());

//  API Routes
app.get('/', (req: Request, res: Response) => {
    res.send('IndriyaX Enterprise API is Running');
});

// Mount the Routers
app.use('/api/v1/auth', authRouter);  
app.use('/api/v1/admin', adminRouter); 
app.use('/api/v1/therapy', therapyRouter);
app.use('/api/v1/users', userRouter);

//  Global Error Handler

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
   
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
import { StatusCodes } from 'http-status-codes';

export const doctor = (req, res, next) => {
    if (req.user.role === 'doctor') {
        next();
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized as a doctor' });
    }
};
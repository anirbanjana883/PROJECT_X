import { StatusCodes } from 'http-status-codes';

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authorized as an admin' });
    }
};
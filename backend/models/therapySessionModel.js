import mongoose from 'mongoose';

const therapySessionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gameId: {
        type: String, // e.g., 'g1', 'g2' (from your frontend IDs)
        required: true
    },
    gameName: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    durationPlayed: {
        type: Number, // in seconds
        required: true
    },
    accuracy: {
        type: Number, // Percentage (0-100) - Optional for now
        default: 0
    },
    status: {
        type: String,
        enum: ['completed', 'aborted'],
        default: 'completed'
    }
}, { timestamps: true });

const TherapySession = mongoose.model('TherapySession', therapySessionSchema);
export default TherapySession;
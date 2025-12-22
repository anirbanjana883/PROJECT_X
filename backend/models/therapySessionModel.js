// backend/models/TherapySession.js
import mongoose from 'mongoose';

const therapySessionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TherapyAssignment',
        required: false 
    },
    gameId: {
        type: String, 
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
        type: Number, 
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'aborted'],
        default: 'completed'
    }
}, { timestamps: true });

const TherapySession = mongoose.model('TherapySession', therapySessionSchema);
export default TherapySession;
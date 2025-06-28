import mongoose from 'mongoose';

const savedFundSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    schemeCode: {
        type: String,
        required: true
    },
    schemeName: {
        type: String,
        required: true
    },
    currentNav: {
        type: String,
        required: false
    },
    savedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

savedFundSchema.index({ userId: 1, schemeCode: 1 }, { unique: true });

export const SavedFund = mongoose.model('SavedFund', savedFundSchema); 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['student', 'admin', 'user'], 
        default: 'student' 
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    resetOtp: {
        type: String
    },
    resetOtpExpires: {
        type: Date
    },
    passwordChangedAt: {
        type: Date
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
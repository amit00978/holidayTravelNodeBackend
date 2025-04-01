const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    tourPackage: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'TourPackage', 
        required: true 
    },
    bookingDate: { type: Date, default: Date.now },
    travelDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Cancelled'], 
        default: 'Pending' 
    },
    numberOfPeople: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Refunded'], 
        default: 'Pending' 
    }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookedroom_number: {              // room number of the booked room
        type: Number,
        required: true
    },
    start_date: {                      // starting date of the booking
        type: Object,
        required: true
    },
    end_date: {                        // ending date of the booking
        type: Object,
        required: true
    },
    booking_customer: {                 // booking belongs to which customer
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: true,
        autopopulate: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})
bookingSchema.plugin(require('mongoose-autopopulate'));

const booking = mongoose.model('bookings', bookingSchema);
module.exports = booking;
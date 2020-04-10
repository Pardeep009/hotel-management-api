const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_number: {                      // a unique room number
        type: Number,
        required: true
    },
    price: {                           // booking price for the room
        type: Number,
        required: true
    },
    capacity: {                         // capacity of the room
        type: Number,
        required: true
    },
    currently_booked: {                // is room currently avialable
        type: Boolean,
        default: false                  // whenever we add a new room,by default it is avilable for booking
    },
    bookings: [{                        // will include all the booking status of the room
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bookings',
    }],
})

const room = mongoose.model('rooms', roomSchema);
module.exports = room;
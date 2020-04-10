const booking = require('../Models/bookings');
const {ObjectId} = require('mongodb');

exports.createNewBooking = async (newBooking) => {
    try {
        let result = await booking.create(newBooking);
        return result;
    }
    catch(error) {
        throw error;
    }
}

exports.cancelBooking = async (bookingId) => {
    try {
        let result = await booking.updateOne({
            _id: ObjectId(bookingId)
        },
        {
            $set: {
                isDeleted: true
            }
        })
        return result;
    }
    catch(error) {
        throw error;
    }
}

exports.findBookingById = (bookingId,callback) => {
    booking.findOne({
        _id: ObjectId(bookingId),
        isDeleted: {
            $ne: true
        }
    },(error, booking) => {
        if(error) {
            callback(error, null);
        }
        else {
            callback(null, booking);
        }   
    })
}
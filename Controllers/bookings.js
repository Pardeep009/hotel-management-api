const booking = require('../Models/bookings');

exports.createNewBooking = async (newBooking) => {
    try {
        let result = await booking.create(newBooking);
        return result;
    }
    catch(error) {
        throw error;
    }
}
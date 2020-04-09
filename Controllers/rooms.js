const room = require('../Models/rooms');

exports.addRoom = (obj,callback) => {
    room.create(obj,(error,result) => {
        if(error)
        {
            callback(error,null);
        }
        else {
            callback(null,result);
        }
    })
}

exports.getAllRooms = (callback) => {
    room.find({},(error,allrooms) => {
        if(error)
        {
            callback(error,null);
        }
        else {
            callback(null,allrooms);
        }
    })
}

exports.currentlyAvialableRooms = (callback) => {
    room.find({
        currently_booked : false
    },(error,allrooms) => {
        if(error)
        {
            callback(error,null);
        }
        else {
            callback(null,allrooms);
        }
    })
}

exports.currentlyNotAvialableRooms = (callback) => {
    room.find({
        currently_booked : true
    },(error,allrooms) => {
        if(error)
        {
            callback(error,null);
        }
        else {
            callback(null,allrooms);
        }
    })
}

exports.makeRoomCurrentlyAvialable = (obj,callback) => {
    room.updateOne({
        room_number : obj.room_number
    },
    {
        $set : {
            currently_booked : false
        }
    },(error,result) => {
        if(error)
        {
            callback(error,null);
        }
        else {
            callback(null,result);
        }
    })
}

exports.makeRoomCurrentlyNotAvialable = (obj,callback) => {
    room.updateOne({
        room_number : obj.room_number
    },
    {
        $set : {
            currently_booked : true 
        }
    },(error,result) => {
        if(error)
        {
            callback(error,null);
        }
        else {
            callback(null,result);
        }
    })
}

exports.getAvialableRooms = (dates,callback) => {
    let booking_dates = {
        checkIn : new Date(dates.checkIn.year, dates.checkIn.month, dates.checkIn.day, 12, 0, 0, 0).getTime(),
        checkOut: new Date(dates.checkOut.year, dates.checkOut.month, dates.checkOut.day, 12, 0, 0, 0).getTime()
    }
    room.find({}).populate('future_bookings').exec((error,rooms) => {
        if(error)
        {
            callback(error,null);
        }
        else {
            rooms = rooms.filter((room) => {
                if(room.future_bookings.length == 0)
                {
                    return true;
                }
                else {
                    for(let i in room.future_bookings) {
                        let booked_dates = {
                            start_date: new Date(room.future_bookings[i].start_date.year, room.future_bookings[i].start_date.month, room.future_bookings[i].start_date.day ,12, 0, 0, 0).getTime(),
                            end_date: new Date(room.future_bookings[i].end_date.year, room.future_bookings[i].end_date.month, room.future_bookings[i].end_date.day, 12, 0, 0, 0).getTime(),
                        }
                        return booking_dates.checkIn >= booked_dates.end_date || booking_dates.checkOut <= booked_dates.start_date ? true : false
                    }
                }
            })
            callback(null,rooms);
        }
    })
}

exports.bookRoom = async (newBooking) => {
    try {
        let result = await room.updateOne({
            room_number: newBooking.room_number,
        },
        {
            $push : {
                future_bookings: newBooking.bookingId
            }
        })
        return result;
    }
    catch(error) {
        throw error;
    }
}
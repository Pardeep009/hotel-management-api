const roomModel = require('../Models/rooms');
const {ObjectId} = require('mongodb');

exports.addRoom = (newRoom,callback) => {
    newRoom.room_number = Number(newRoom.room_number);
    newRoom.price = Number(newRoom.price);
    newRoom.capacity = Number(newRoom.capacity);
    roomModel.create(newRoom,(error,result) => {
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
    roomModel.find({},(error,allrooms) => {
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
    roomModel.find({
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
    roomModel.find({
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

exports.makeRoomCurrentlyAvialable = (room,callback) => {
    roomModel.updateOne({
        room_number : Number(room.room_number)
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

exports.makeRoomCurrentlyNotAvialable = (room,callback) => {
    roomModel.updateOne({
        room_number : Number(room.room_number)
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
    roomModel.find({}).populate('bookings').exec((error,allRooms) => {
        if(error)
        {
            callback(error,null);
        }
        else {
            allRooms = allRooms.filter((room) => {
                if(room.bookings.length === 0)
                {
                    return true;
                }
                else {
                    for(let i in room.bookings) {
                        if(room.bookings[i].isDeleted === true) {
                            return true;
                        }
                        let booked_dates = {
                            start_date: new Date(room.bookings[i].start_date.year, room.bookings[i].start_date.month, room.bookings[i].start_date.day ,12, 0, 0, 0).getTime(),
                            end_date: new Date(room.bookings[i].end_date.year, room.bookings[i].end_date.month, room.bookings[i].end_date.day, 12, 0, 0, 0).getTime(),
                        }
                        return booking_dates.checkIn >= booked_dates.end_date || booking_dates.checkOut <= booked_dates.start_date ? true : false
                    }
                }
            })
            callback(null,allRooms);
        }
    })
}

exports.bookRoom = async (newBooking) => {
    try {
        let result = await roomModel.updateOne({
            room_number: Number(newBooking.room_number),
        },
        {
            $push : {
                bookings: ObjectId(newBooking.bookingId)
            }
        })
        return result;
    }
    catch(error) {
        throw error;
    }
}

exports.cancelBooking = async (booking) => {
    try {
        let result = await roomModel.updateOne({
            room_number: Number(booking.room_number),
        },
        {
            $pull : {
                bookings: ObjectId(booking.bookingId)
            }
        })
        return result;
    }
    catch(error) {
        throw error;
    }
}
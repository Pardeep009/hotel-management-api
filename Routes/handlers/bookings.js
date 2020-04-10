const express = require("express");
const router = express.Router();
const roomsController = require('../../Controllers/rooms');
const bookingsController = require('../../Controllers/bookings');
const customersController = require('../../Controllers/customers');

/*
book given number of rooms for a given start date and end date
req.body = {
    required_no_of_rooms: 3,
    checkInDate : {
        year: 2020
        month: 12
        day:  3
    },
    checkOutDate : {
        year: 2020
        month: 12
        day: 6
    },
    customerPhone : 7777777777,
}
*/
router.post('/bookRooms', (req,res) => {                                  
    let obj = {...req.body};
    obj.required_no_of_rooms = Number(obj.required_no_of_rooms);
    roomsController.getAvialableRooms({
        checkIn : obj.checkInDate,
        checkOut : obj.checkOutDate
    },(error,avialableRooms) => {
        if(error) {
            console.log(error);
            res.status(500).json({
                msg : 'Internal Server Error!!!'
            })
        }
        else {
            if(avialableRooms.length >= obj.required_no_of_rooms) {
                customersController.findCustomerByPhone(obj.customerPhone,(error,customer) => {
                    if(error) {
                        console.log(error);
                        res.status(500).json({
                            msg : 'Internal Server Error!!!'
                        })
                    }
                    else {
                        console.log(customer);
                        if(!customer) {
                            console.log('hh');
                            let newCustomer = {
                                    phone_number: Number(obj.customerPhone),
                            }
                            customersController.addNewCustomer(newCustomer,(error,result) => {
                                if(error) {
                                    console.log(error);
                                    res.status(500).json({
                                        msg : 'Internal Server Error!!!'
                                    })
                                }
                                else {
                                    console.log(result);
                                    doBooking(obj,avialableRooms,result._id,res);
                                }
                            })
                        }
                        else {
                            doBooking(obj,avialableRooms,customer._id,res);
                        }
                    }
                });
            }
            else {
                res.status(400).json({
                    msg : 'Required Number of Rooms are not Avialable'
                })
            }
        }
    })
})

async function doBooking(obj, avialableRooms, customerId, res) {
    let newBookingIds = [];
    for(let i=0;i<Number(obj.required_no_of_rooms);i++) {
        let newBooking = {
            bookedroom_number: avialableRooms[i].room_number,
            start_date: obj.checkInDate,
            end_date: obj.checkOutDate,
            booking_customer: customerId
        }
        try {
            let booking = await bookingsController.createNewBooking(newBooking);
            await roomsController.bookRoom({
                room_number: avialableRooms[i].room_number,
                bookingId: booking._id
            })
            await customersController.addNewBooking({
                customerId: customerId,
                bookingId: booking._id
            })
            newBookingIds.push(booking._id);
        }
        catch(error) {
            res.status(500).json({
                msg: 'Internal Server Error!!!'
            })
        }
    }
    res.status(200).json({
        msg: 'done',
        bookingId: newBookingIds
    })
}

/* cancel booking of a given booking id
req.body = {
    bookingId : 5c0cd37153705210118d090e,
}
*/
router.post('/cancelBooking',(req,res) => {
    let obj = {...req.body};  
    bookingsController.findBookingById(obj.bookingId,async (error, booking) => {
        if(error) {
            console.log(error);
            res.status(500).json({
                msg: 'Internal Server Error!!!'
            })
        }
        else if(!booking) {
            res.status(400).json({
                mag: 'Wrong Booking id'
            })
        }
        else {
            try {
                await bookingsController.cancelBooking(obj.bookingId)
                await roomsController.cancelBooking({
                    room_number: booking.bookedroom_number,
                    bookingId: obj.bookingId
                })
                await customersController.cancelBooking({
                    bookingId: obj.bookingId,
                    customerId: booking.booking_customer
                })
                res.status(200).json({
                    msg: 'Booking Deleted'
                })
            }
            catch(error) {
                console.log(error);
                res.status(500).json({
                    msg: 'Internal Server Error!!!'
                })
            }
        }
    })
})

module.exports = router;
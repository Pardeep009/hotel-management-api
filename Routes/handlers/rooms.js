const express = require("express");
const router = express.Router();
const roomsController = require('../../Controllers/rooms');
const validator = require('../../Middlewares/validator');

/*
add a new room in hotel 
req.body = {
    room_number : A unique Integer for every room,
    price : A number denoting booking price of that room,
    capacity : A Integer showing capacity of the room
}
*/
router.post('/addRoom',validator.NewRoomValidator,(req,res) => {               
    let newRoom = {...req.body};
    roomsController.addRoom(newRoom,(error,result) => {
        if(error) {
            console.log(error);
            res.status(500).json({
                msg : 'Server error!!!'
            })
        }
        else {
            console.log(result);
            res.status(200).json({
                msg : 'Room Added'
            });
        }
    })
})

router.post('/viewAllRooms',(req,res) => {                                     // view all the rooms of hotel                      // view all the rooms of hotel
    roomsController.getAllRooms((error,allRooms) => {
        if(error) {
            console.log(error);
            res.status(500).json({
                msg : 'Server error!!!'
            })
        }
        else {
            res.status(200).json({
                rooms : allRooms
            });
        }
    })
})

router.post('/viewCurrentlyAvialableRooms',(req,res) => {                 // view all the rooms which are currently avialable
    roomsController.currentlyAvialableRooms((error,allRooms) => {
        if(error) {
            console.log(error);
            res.status(500).json({
                msg : 'Server error!!!'
            })
        }
        else {
            res.status(200).json({
                rooms : allRooms
            });
        }
    })
})

router.post('/viewCurrentlyNotAvialableRooms',(req,res) => {             // view all the rooms which are currently not avialable
    roomsController.currentlyNotAvialableRooms((error,allRooms) => {
        if(error) {
            console.log(error);
            res.status(500).json({
                msg : 'Server error!!!'
            })
        }
        else {
            res.status(200).json({
                rooms : allRooms
            });
        }
    })
})

/*
view all the rooms which are avialable in between given dates
req.body = {
    checkInDate : {
        year: 2020,
        month: 12,
        day:  3
    },
    checkOutDate : {
        year: 2020,
        month: 12,
        day: 6
    }
}
*/
router.post('/viewAvialableRooms',(req,res) => {
    let obj = {...req.body};
    console.log(obj);
    roomsController.getAvialableRooms({
        checkIn : obj.checkInDate,
        checkOut : obj.checkOutDate
    },(error,rooms) => {
        if(error)
        {
            console.log(error);
            res.status(500).json({
                msg: 'Server Error!!!'
            })
        }
        else {
            res.status(200).json({
                avialableRooms : rooms
            })
        }
    })
})

module.exports = router;
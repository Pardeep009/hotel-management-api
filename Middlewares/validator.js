const room = require('../Models/rooms');

exports.NewRoomValidator = (req,res,next) => {
    let newRoom = { ...req.body };
    if(!newRoom) {
        return res.status(400).json({
            msg : 'Empty Request',
        })
    }
     if(!newRoom.room_number) {
        return res.status(400).json({
            msg : 'Please assign a number to new room',
        })  
    }
    else if(!newRoom.price) {
        return res.status(400).json({
            msg : 'Please enter the price for new room',
        }) 
    }
    else if(!newRoom.capacity) {
        return res.status(400).json({
            msg : 'Please mention the capacity for new room',
        }) 
    }
    room.findOne({ room_number : Number(newRoom.room_number)},(error,result) => {
        if(error)
        throw error;
        else {
            if(result) {
                return res.status(400).json({
                    msg : 'Room number already in use'
                })
            }
            else {
                next();
            }
        }
    })
}

// more validators will be added soon
const customer = require('../Models/customers');
const {ObjectId} = require('mongodb');

exports.findCustomerByPhone = (customerPhone,callback) => {
    customer.findOne({
            phone_number : Number(customerPhone)
    },(error,customer) => {
        if(error) {
            callback(error,null);
        }
        else {
            callback(null,customer);
        }
    })
}

exports.addNewCustomer = (newCustomer,callback) => {
    customer.create(newCustomer
    ,(error,result) => {
        if(error) {
            callback(error,null);
        }
        else {
            callback(null,result);
        }
    })
}

exports.addNewBooking = async (newBooking) => {
    try {
        let result = await customer.updateOne({
            _id: ObjectId(newBooking.customerId),
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
        let result = await customer.updateOne({
            _id: ObjectId(booking.customerId),
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
const customer = require('../Models/customers');

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

exports.findCustomerByEmail = (customerEmail,callback) => {
    customer.findOne({
            email : customerEmail
    },(error,customer) => {
        if(error) {
            callback(error,null);
        }
        else {
            callback(null,customer);
        }
    })
}

// exports.addNewCustomer = (customer,callback) => {
//     customer.create({ 
//         customer 
//     }
//     ,(error,result) => {
//         if(error) {
//             callback(error,null);
//         }
//         else {
//             callback(null,result);
//         }
//     })
// }

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
            _id: newBooking.customerId,
        },
        {
            $push : {
                customer_bookings: newBooking.bookingId
            }
        })
        return result;
    }
    catch(error) {
        throw error;
    }
}
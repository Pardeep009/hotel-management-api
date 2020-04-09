const mongoose = require("mongoose");
const schema = mongoose.Schema;

const customerSchema = new mongoose.Schema({
    phone_number: {                 // unique phone number for every customer
        type: Number,
        required : true
    },
    customer_bookings: [{            // booking status for each customer
        type: schema.Types.ObjectId,
        ref: "bookings"
    }]
})

module.exports = mongoose.model("customers", customerSchema);
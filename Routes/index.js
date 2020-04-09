let express = require('express');
let router = express.Router();

router.use('/rooms',require('./handlers/rooms.js'));          // rooms related services

router.use('/bookings',require('./handlers/bookings.js'));    // bookings related services

module.exports = router;

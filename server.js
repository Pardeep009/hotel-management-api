
 if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require("express"); 
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

mongoose.connect(`${process.env.DATABASE_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB Connected..."))
  .catch(error => console.log("DB Connectioin error ", error));

  // Middleware
app.use(morgan("dev"));     // logger for terminal
app.use(bodyParser.json()); // to read the data
app.use(cors());

app.use('/',require('./Routes/index'));

app.listen(`${process.env.PORT}`, function() {
    console.log(`Server is up. Running on port ${process.env.PORT}`);
});
  
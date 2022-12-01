const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = mongoose;

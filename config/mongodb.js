const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/confession', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

module.exports = mongoose;

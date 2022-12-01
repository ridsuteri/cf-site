const mongoose = require('../config/mongodb');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String
    }
})

module.exports = mongoose.model('Post', postSchema);
"use strict";
const mongoose = require('mongoose');
// mongodb + srv://fahad:<password>@cluster0.kiamidu.mongodb.net/?retryWrites=true&w=majority
require("dotenv").config();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.User_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err, "error mongodeb"));
// creact a schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('User', userSchema);

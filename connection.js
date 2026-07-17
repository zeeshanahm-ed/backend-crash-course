const mongoose = require("mongoose");

function connectMongoose() {
    return mongoose.connect("mongodb://127.0.0.1:27017/nodejsTest");
};

module.exports = connectMongoose;


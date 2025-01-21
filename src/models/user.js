const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
        
    },
    lastName: {
        type: String,
        minLength: 2,
        max: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        smallcase: true
    },
    password: {
        type: String
    },
    age: {
        type: Number,
        max: 99
    },
    gender: {
        type: String
    },
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)

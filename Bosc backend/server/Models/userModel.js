const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    firstName: {
        type: String,
        required: [true, "Firstname is required"]
    },
    lastName: {
        type: String,
        required: [true, "Lastname is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    pic: {
        type: String,
        required: true,
        default:
            "https://www.w3schools.com/howto/img_avatar.png"
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model("User", userSchema);
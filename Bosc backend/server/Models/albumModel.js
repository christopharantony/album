const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    coverPic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    photos : {
        type: [String],
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model("Album", albumSchema);

const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Videos = new schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
    },
},
{timestamps: true}
);

const VideosModel = mongoose.model("Videos", Videos);

module.exports = VideosModel;
const { model, Schema, ObjectId } = require("mongoose");

const imageSchema = new Schema({
    publicId: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: false,
    },
});

const Image = model("Image", imageSchema);
module.exports = Image;
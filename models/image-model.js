const { model, Schema, ObjectId } = require("mongoose");

const imageSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
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
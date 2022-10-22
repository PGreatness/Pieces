const { model, Schema, ObjectId } = require("mongoose");

const layerSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    layerName: {
        type: String,
        required: true,
    },
    visible: {
        type: Boolean,
        required: true,
    },
    opacity: {
        type: Number,
        required: true,
    }
});

const Layer = model("Layer", layerSchema);
module.exports = Layer;
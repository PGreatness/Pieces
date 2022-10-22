const { model, Schema, ObjectId } = require("mongoose");

const tileSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    tilesetId: {
        type: ObjectId,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    width: {
        type: Number,
        required: true,
    }
});

const Tile = model("Tile", tileSchema);
module.exports = Tile;
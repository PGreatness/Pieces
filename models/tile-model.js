const { model, Schema, ObjectId } = require("mongoose");

const tileSchema = new Schema({
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
    },
    tileData: {
        type: [String],
        required: true
    },
    tileImage: {
        type: String,
        required: false
    }
});

const Tile = model("Tile", tileSchema);
module.exports = Tile;
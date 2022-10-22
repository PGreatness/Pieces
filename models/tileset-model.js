const { model, Schema, ObjectId } = require("mongoose");
const Tile = require("./tile-model").schema;

const tilesetSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    tilesetName: {
        type: String,
        required: true,
    },
    tilesetDesc: {
        type: String,
        required: false,
    },
    tilesetTags: {
        type: [String],
        required: false,
    },
    tilesetBackgroundColor: {
        type: String,
        required: false,
    },
    imagePixelHeight: {
        type: Number,
        required: true,
    },
    imagePixelWidth: {
        type: Number,
        required: true,
    },
    tileHeight: {
        type: Number,
        required: true,
    },
    tileWidth: {
        type: Number,
        required: true,
    },
    padding: {
        type: Number,
        required: false,
    },
    source: {
        type: String,
        required: true
    },
    ownerId: {
        type: ObjectId,
        required: true,
    },
    collaboratorIds: {
        type: [ObjectId],
        required: false,
    },
    isPublic: {
        type: Boolean,
        required: true,
    },
    isLocked: {
        type: Boolean,
        required: true,
    },
    tiles: {
        type: [Tile],
        required: true,
    },
});

const Tileset = model("Tileset", tilesetSchema);
module.exports = Tileset;
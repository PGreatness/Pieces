const { model, Schema, ObjectId } = require("mongoose");
const Layer = require("./layer-model").schema;

const mapSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    mapName: {
        type: String,
        required: true,
    },
    mapDescription: {
        type: String,
        required: false,
    },
    mapBackgroundColor: {
        type: String,
        required: false,
    },
    mapHeight: {
        type: Number,
        required: true,
    },
    mapWidth: {
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
    tilesets: {
        type: [ObjectId],
        required: false,
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
    layers: {
        type: [Layer],
        required: false
    }
});

const Map = model("Map", mapSchema);
module.exports = Map;
const { model, Schema, ObjectId } = require("mongoose");
const Layer = require("./layer-model").schema;

const mapSchema = new Schema({
    mapName: {
        type: String,
        required: true,
    },
    mapDescription: {
        type: String,
        required: false,
    },
    tags: {
        type: [String],
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
    tiles: {
        types: [ObjectId],
        required: false,
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
    },
    likes: {
        type: [ObjectId],
        required: true,
    },
    dislikes: {
        type: [ObjectId],
        required: false,
    },
    favs: {
        type: [ObjectId],
        required: false,
    },
    downloads: {
        type: Number,
        required: false,
    },
    comments: {
        type: [ObjectId],
        required: false,
    },
});

const Map = model("Map", mapSchema);
module.exports = Map;
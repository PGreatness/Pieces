const { model, Schema, ObjectId } = require("mongoose");

const mapSchema = new Schema({
    title: {
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
    likes: {
        type: [ObjectId],
        required: false,
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
}, { timestamps: true });

const Map = model("Map", mapSchema);
module.exports = Map;
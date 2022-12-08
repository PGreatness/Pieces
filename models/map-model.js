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
        type: [Number],
        required: true,
    },
    tilesets: {
        type: [ObjectId],
        required: true,
    },
    ownerId: {
        type: ObjectId,
        required: true,
    },
    collaboratorIds: {
        type: [ObjectId],
        required: true,
    },
    isPublic: {
        type: Boolean,
        required: true,
    },
    likes: {
        type: [ObjectId],
        required: true,
    },
    dislikes: {
        type: [ObjectId],
        required: true,
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
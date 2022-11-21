const { model, Schema, ObjectId } = require("mongoose");
const Reply = require("./reply-model").schema;

const threadSchema = new Schema({

    threadName: {
        type: String,
        required: true,
    },
    threadText: {
        type: String,
        required: true,
    },
    senderId: {
        type: ObjectId,
        required: true,
    },
    replies: {
        type: [Reply],
        required: true
    },
    likes: {
        type: [ObjectId],
        required: true,
    },
    dislikes: {
        type: [ObjectId],
        required: true,
    },
},
    {
        timestamps: true
    });

const Thread = model("Thread", threadSchema);
module.exports = Thread;
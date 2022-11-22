const { model, Schema, ObjectId } = require("mongoose");

const repliesSchema = new Schema({
    senderId: {
        type: ObjectId,
        required: true,
    },
    replyMsg: {
        type: String,
        required: true,
    },
    replyingTo: {
        type: ObjectId,
        required: true,
    },
    isFirstLevel: {
        type: Boolean,
        required: true,
    },
    replies: {
        type: [ObjectId],
        required: true
    }
},
{
    timestamps: true,
});

const Reply = model("Reply", repliesSchema);
module.exports = Reply;
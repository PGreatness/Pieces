const { model, Schema, ObjectId } = require("mongoose");

const repliesSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    senderId: {
        type: ObjectId,
        required: true,
    },
    replyMsg: {
        type: String,
        required: true,
    },
    sentAt: {
        type: String,
        required: true,
    },
    replyingTo: {
        type: ObjectId,
        required: true,
    },
    // replies: {
    //     type: [repliesSchema],
    //     required: true
    // }
});

const Reply = model("Reply", repliesSchema);
module.exports = Reply;
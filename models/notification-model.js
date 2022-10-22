const { model, Schema, ObjectId } = require("mongoose");

const notificationSchema = new Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        required: true,
    },
    notificationMsg: {
        type: String,
        required: true,
    },
    sentAt: {
        type: String,
        required: true,
    },
});

const Notification = model("Notification", notificationSchema);
module.exports = Notification;
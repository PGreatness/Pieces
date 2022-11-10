const { model, Schema, ObjectId } = require("mongoose");

const notificationSchema = new Schema({
    senderId: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        required: true,
    },
    mapId: {
        type: String,
        required: false,
    }, 
    tilesetId: {
        type: String,
        required: false,
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
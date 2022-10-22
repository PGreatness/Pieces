const { model, Schema, ObjectId } = require("mongoose");
const Notification = require("./notification-model").schema;
const Image = require("./image-model").schema;

const UserSchema = new Schema(
    {
        _id: {
			type: ObjectId,
			required: true
        },
        firstName: { 
            type: String, 
            required: true 
        },
        lastName: { 
            type: String, 
            required: true 
        },
        userName: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true 
        },
        passwordHash: { 
            type: String, 
            required: true 
        },
        notifications: {
            type: [Notification],
            required: true
        },
        profilePic: {
            type: Image,
            required: false
        },
        bio: {
            type: String,
            required: true
        },
        friends: {
            type: [String],
            required: true
        },
        chats: {
            type: [String],
            required: true
        }

    },
    { timestamps: true },
)

module.exports = model('User', UserSchema)
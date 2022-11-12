const User = require('../models/user-model')
const Notification = require('../models/notification-model')
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require('mongoose')



// Sends a notification to map Owner
requestMapEdit = async (req, res) => {
    const { senderId, receiverId, mapId, title } = req.body;

    const objectSenderId = new ObjectId(senderId);
    const sender = await User.findById(objectSenderId);
    if (!sender)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (Sender)" });

    const objectReceiverId = new ObjectId(receiverId);
    const receiver = await User.findOne({ _id: objectReceiverId });
    if (!receiver)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (Receiver)" });

    var d = new Date();
    let options = {
        weekday: "long", year: "numeric", month: "long",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        timeZone: "UTC",
    };
    var d = new Date().toLocaleString("en-US", options);

    const notification = new Notification({
        senderId: senderId,
        seen: false,
        mapId: mapId,
        notificationMsg:
            sender.firstName +
            " " +
            sender.lastName +
            " is requesting access to edit map '" +
            title +
            "' with you.",
        sentAt: d,
    });


    receiver.notifications.push(notification);
    await notification.save()
    console.log(notification)

    await receiver.save().then(() => {
        return res.status(200).json({
            success: true,
            user: receiver,
            message: 'Notification has been sent!'
        })

    }).catch((err) => {
        console.log(err)
        return res.status(404).json({
            success: false,
            message: 'Failed to send notification'
        })

    })
}





// Sends a notification to tileset Owner
requestTilesetEdit = async (req, res) => {
    const { senderId, receiverId, tilesetId, title } = req.body;

    const objectSenderId = new ObjectId(senderId);
    const sender = await User.findById(objectSenderId);
    if (!sender)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (Sender)" });

    const objectReceiverId = new ObjectId(receiverId);
    const receiver = await User.findOne({ _id: objectReceiverId });
    if (!receiver)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (Receiver)" });

    var d = new Date();
    let options = {
        weekday: "long", year: "numeric", month: "long",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        timeZone: "UTC",
    };
    var d = new Date().toLocaleString("en-US", options);

    const notification = new Notification({
        senderId: senderId,
        seen: false,
        tilesetId: tilesetId,
        notificationMsg:
            sender.firstName +
            " " +
            sender.lastName +
            " is requesting access to edit tileset '" +
            title +
            "' with you.",
        sentAt: d,
    });


    receiver.notifications.push(notification);
    await notification.save()
    console.log(notification)

    await receiver.save().then(() => {
        return res.status(200).json({
            success: true,
            user: receiver,
            message: 'Notification has been sent!'
        })

    }).catch((err) => {
        console.log(err)
        return res.status(404).json({
            success: false,
            message: 'Failed to send notification'
        })

    })
}



module.exports = {
    requestMapEdit,
    requestTilesetEdit
}
const User = require('../models/user-model')
const Notification = require('../models/notification-model')
const Map = require('../models/map-model');
const Tileset = require('../models/tileset-model');
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


    const chosenMap = await Map.findById(mongoose.Types.ObjectId(mapId));        
    if (!chosenMap) {
        return res.status(400).json({
            success: false,
            message: "Map does not exist"
        })
    }

    if (chosenMap.collaboratorIds.includes(senderId)) {
        return res.status(400).json({
            success: false,
            message: "You are already a collaborator of this map"
        })
    }

    var d = new Date();
    let options = {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        timeZone: "EST",
    };
    var d = new Date().toLocaleString("en-US", options);

    const notification = new Notification({
        senderId: senderId,
        seen: false,
        action: true,
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


// Sends a notification to user if collaborator added, denied or friend added, denied
mapActionNotif = async (req, res) => {
    const { ownerId, newUserId, mapId } = req.body;

    const objectOwnerId = new ObjectId(ownerId);
    const owner = await User.findById(objectOwnerId);
    if (!owner)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (owner user)" });

    const objectNewUserId = new ObjectId(newUserId);
    const addedUser = await User.findOne({ _id: objectNewUserId });
    if (!addedUser)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (added user))" });



    if (!mapId) {
        return res.status(400).json({
            success: false,
            error: "Map ID is required"
        })
    }

    var mid;

    try {
        mid = mongoose.Types.ObjectId(mapId);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid Map ID format",
            error: err
        })
    }

    const currentMap = await Map.findById(mid);
    let collaborators = currentMap.collaboratorIds

    let oldCollaborators = collaborators.filter(collab => {
        return !collab.equals(objectNewUserId)
    })

    console.log(oldCollaborators)

    var d = new Date();
    let options = {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        timeZone: "EST",
    };
    var d = new Date().toLocaleString("en-US", options);

    const notification = new Notification({
        senderId: ownerId,
        seen: false,
        action: false,
        notificationMsg:
            addedUser.firstName +
            " " +
            addedUser.lastName +
            " is now a collaborator of '" +
            currentMap.title +
            "'.",
        sentAt: d,
    });

    // let owner know
    owner.notifications.push(notification);

    // let new Collab know
    const notificationSender = new Notification({
        senderId: ownerId,
        seen: false,
        action: false,
        notificationMsg:
            "You have been granted editing rights to map, '" +
            currentMap.title +
            "'. Happy collaborating! ",
        sentAt: d,
    });
    addedUser.notifications.push(notificationSender);
    await addedUser.save()

    for (const col of oldCollaborators) {
        let user = await User.findOne({ _id: ObjectId(col) });
        user.notifications.push(notification);
        await user.save()
    };

    await owner.save().then(() => {
        return res.status(200).json({
            success: true,
            user: owner,
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





// Sends a notification to user if collaborator added, denied or friend added, denied
mapDenyNotif = async (req, res) => {
    const { ownerId, newUserId, mapId } = req.body;

    const objectOwnerId = new ObjectId(ownerId);
    const owner = await User.findById(objectOwnerId);
    if (!owner)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (owner user)" });

    const objectNewUserId = new ObjectId(newUserId);
    const addedUser = await User.findOne({ _id: objectNewUserId });
    if (!addedUser)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (added user))" });



    if (!mapId) {
        return res.status(400).json({
            success: false,
            error: "Map ID is required"
        })
    }

    var mid;

    try {
        mid = mongoose.Types.ObjectId(mapId);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid Map ID format",
            error: err
        })
    }

    const currentMap = await Map.findById(mid);

    let options = {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        timeZone: "EST",
    };
    var d = new Date().toLocaleString("en-US", options);

    // let rejected Collab know
    const notificationSender = new Notification({
        senderId: ownerId,
        seen: false,
        action: false,
        notificationMsg:
            "You were denied editing rights to map, '" +
            currentMap.title +
            "' by owner.",
        sentAt: d,
    });
    addedUser.notifications.push(notificationSender);

    await addedUser.save()


    // let owner know
    const notification = new Notification({
        senderId: ownerId,
        seen: false,
        action: false,
        notificationMsg:
            "You denied " + addedUser.firstName + " " +
            addedUser.lastName + " editing rights to map, '" +
            currentMap.title +
            "'.",
        sentAt: d,
    });
    owner.notifications.push(notification);

    await owner.save().then(() => {
        return res.status(200).json({
            success: true,
            user: owner,
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
    console.log(tilesetId)

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
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        timeZone: "EST",
    };
    var d = new Date().toLocaleString("en-US", options);

    const notification = new Notification({
        senderId: senderId,
        seen: false,
        action: true,
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



// Sends a notification to user if collaborator added, denied or friend added, denied
tilesetActionNotif = async (req, res) => {
    const { ownerId, newUserId, tilesetId } = req.body;
    console.log(newUserId)

    const objectOwnerId = new ObjectId(ownerId);
    const owner = await User.findById(objectOwnerId);
    if (!owner)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (owner user)" });

    const objectNewUserId = new ObjectId(newUserId);
    const addedUser = await User.findOne({ _id: objectNewUserId });
    if (!addedUser)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (added user))" });



    if (!tilesetId) {
        return res.status(400).json({
            success: false,
            error: "Tileset ID is required"
        })
    }

    var mid;

    try {
        mid = mongoose.Types.ObjectId(tilesetId);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid Tileset ID format",
            error: err
        })
    }

    const currentTileset = await Tileset.findById(mid);
    let collaborators = currentTileset.collaboratorIds
    let oldCollaborators = collaborators.filter(collab => {
        return !collab.equals(objectNewUserId)
    })

    console.log(oldCollaborators)

    var d = new Date();
    let options = {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        timeZone: "EST",
    };
    var d = new Date().toLocaleString("en-US", options);

    const notification = new Notification({
        senderId: ownerId,
        seen: false,
        action: false,
        notificationMsg:
            addedUser.firstName +
            " " +
            addedUser.lastName +
            " is now a collaborator of '" +
            currentTileset.title +
            "'.",
        sentAt: d,
    });

    // let owner know
    owner.notifications.push(notification);

    // let new Collab know
    const notificationSender = new Notification({
        senderId: ownerId,
        seen: false,
        action: false,
        notificationMsg:
            "You have been granted editing rights to tileset, '" +
            currentTileset.title +
            "'. Happy collaborating! ",
        sentAt: d,
    });
    addedUser.notifications.push(notificationSender);
    await addedUser.save()

    for (const col of oldCollaborators) {
        let user = await User.findOne({ _id: ObjectId(col) });
        user.notifications.push(notification);
        await user.save()
    };

    await owner.save().then(() => {
        return res.status(200).json({
            success: true,
            user: owner,
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


// Sends a notification to user if collaborator added, denied or friend added, denied
tilesetDenyNotif = async (req, res) => {
    const { ownerId, newUserId, tilesetId } = req.body;

    const objectOwnerId = new ObjectId(ownerId);
    const owner = await User.findById(objectOwnerId);
    if (!owner)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (owner user)" });

    const objectNewUserId = new ObjectId(newUserId);
    const addedUser = await User.findOne({ _id: objectNewUserId });
    if (!addedUser)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (added user))" });



    if (!tilesetId) {
        return res.status(400).json({
            success: false,
            error: "Tileset ID is required"
        })
    }

    var mid;

    try {
        mid = mongoose.Types.ObjectId(tilesetId);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid Tileset ID format",
            error: err
        })
    }

    const currentTileset = await Tileset.findById(mid);

    let options = {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        timeZone: "EST",
    };
    var d = new Date().toLocaleString("en-US", options);

    // let rejected Collab know
    const notificationSender = new Notification({
        senderId: ownerId,
        seen: false,
        action: false,
        notificationMsg:
            "You were denied editing rights to tileset, '" +
            currentTileset.title +
            "' by owner.",
        sentAt: d,
    });
    addedUser.notifications.push(notificationSender);

    await addedUser.save()


    // let owner know
    const notification = new Notification({
        senderId: ownerId,
        seen: false,
        action: false,
        notificationMsg:
            "You denied " + addedUser.firstName + " " +
            addedUser.lastName + " editing rights to tileset, '" +
            currentTileset.title +
            "'.",
        sentAt: d,
    });
    owner.notifications.push(notification);

    await owner.save().then(() => {
        return res.status(200).json({
            success: true,
            user: owner,
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


// Sends a friend request notification to user 
friendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

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


    // check if already friends, then pop up error msg
    if (sender.friends.includes(receiverId)) {
        return res.status(400).json({
            success: false,
            message: "You are already friends!"
        })
    }

    if (receiver.friends.includes(senderId)) {
        return res.status(400).json({
            success: false,
            message: "You are already friends!"
        })
    }

    var d = new Date();
    let options = {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        timeZone: "EST",
    };
    var d = new Date().toLocaleString("en-US", options);


    const notification = new Notification({
        senderId: senderId,
        seen: false,
        action: true,
        notificationMsg:
            sender.firstName +
            " " +
            sender.lastName +
            " wants to be your friend!",
        sentAt: d,
    });


    receiver.notifications.push(notification);
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


// Sends a notification to both users if friend request accepted
approveFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    const objectSenderId = new ObjectId(senderId);
    const sender = await User.findById(objectSenderId);
    if (!sender)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (sender)" });

    const objectReceiverId = new ObjectId(receiverId);
    const receiver = await User.findOne({ _id: objectReceiverId });
    if (!receiver)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (receiver))" });


    var d = new Date();
    let options = {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        timeZone: "EST",
    };
    var d = new Date().toLocaleString("en-US", options);

    const notificationSender = new Notification({
        senderId: receiverId,
        seen: false,
        action: false,
        notificationMsg:
            receiver.firstName +
            " " +
            receiver.lastName +
            " accepted your friend request!",
        sentAt: d,
    });

    // let owner know
    sender.notifications.push(notificationSender);
    await sender.save()

    // let new Collab know
    const notificationReceiver = new Notification({
        senderId: senderId,
        seen: false,
        action: false,
        notificationMsg:
            sender.firstName +
            " " +
            sender.lastName +
            " is now your friend!",
        sentAt: d,
    });
    receiver.notifications.push(notificationReceiver);

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


// Sends a notification to both users if friend request denied
denyFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;

    const objectSenderId = new ObjectId(senderId);
    const sender = await User.findById(objectSenderId);
    if (!sender)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (sender)" });

    const objectReceiverId = new ObjectId(receiverId);
    const receiver = await User.findOne({ _id: objectReceiverId });
    if (!receiver)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (receiver))" });

    var d = new Date();
    let options = {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        timeZone: "EST",
    };
    var d = new Date().toLocaleString("en-US", options);

    const notificationSender = new Notification({
        senderId: receiverId,
        seen: false,
        action: false,
        notificationMsg:
            receiver.firstName +
            " " +
            receiver.lastName +
            " denied your friend request.",
        sentAt: d,
    });

    // let sender know
    sender.notifications.push(notificationSender);
    await sender.save()

    // let receiver know
    const notificationReceiver = new Notification({
        senderId: senderId,
        seen: false,
        action: false,
        notificationMsg:
            " You denied " +
            sender.firstName +
            " " +
            sender.lastName +
            "'s friend request.",
        sentAt: d,
    });
    receiver.notifications.push(notificationReceiver);

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



// Removes a notification  
removeNotification = async (req, res) => {
    const { id, userId } = req.body;

    const objectUserId = new ObjectId(userId);
    const objectNotifId = new ObjectId(id);
    const sender = await User.findById(objectUserId);
    if (!sender)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (Sender)" });


    if (!sender.notifications.some(notif => notif._id.equals(objectNotifId))) {
        return res
            .status(400)
            .json({ message: "User doesnt have this notification)" });
    }

    await User.findOneAndUpdate(
        { '_id': objectUserId },
        { $pull: { notifications: { _id: objectNotifId } } },
        { returnOriginal: false },
    ).then((newUser) => {
        console.log(newUser)
        return res.status(200).json({
            success: true,
            user: newUser,
            message: 'Notification has been deleted!'
        })

    }).catch((err) => {
        console.log(err)
        return res.status(404).json({
            success: false,
            message: 'Failed to delete notification'
        })

    })
}

// Removes all notifications  
removeAllNotifications = async (req, res) => {
    const { userId } = req.body;

    const objectUserId = new ObjectId(userId);
    const sender = await User.findById(objectUserId);
    if (!sender)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (Sender)" });

    await User.findOneAndUpdate(
        { '_id': objectUserId },
        { $set: { notifications: [] } },
        { returnOriginal: false },
    ).then((newUser) => {
        console.log(newUser)
        return res.status(200).json({
            success: true,
            user: newUser,
            message: 'All Notifications have been deleted!'
        })

    }).catch((err) => {
        console.log(err)
        return res.status(404).json({
            success: false,
            message: 'Failed to delete notifications'
        })

    })
}


markAllSeen = async (req, res) => {
    const { userId } = req.body;

    const objectUserId = new ObjectId(userId);
    const sender = await User.findById(objectUserId);
    if (!sender)
        return res
            .status(400)
            .json({ message: "Account with specified id not found. (Sender)" });

    await User.findOneAndUpdate(
        { '_id': objectUserId },
        { $set: { "notifications.$[].seen": true } },
        { returnOriginal: false },
    ).then((newUser) => {
        console.log(newUser)
        return res.status(200).json({
            success: true,
            user: newUser,
            message: 'All Notifications have been marked seen!'
        })

    }).catch((err) => {
        console.log(err)
        return res.status(404).json({
            success: false,
            message: 'Failed to mark notifications as seen'
        })

    })
}

module.exports = {
    requestMapEdit,
    requestTilesetEdit,
    friendRequest,
    removeNotification,
    mapActionNotif,
    mapDenyNotif,
    tilesetActionNotif,
    tilesetDenyNotif,
    approveFriendRequest,
    denyFriendRequest,
    removeAllNotifications,
    markAllSeen
}
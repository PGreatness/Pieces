const auth = require('../auth/tokens');
const User = require('../models/user-model')
const Notification = require('../models/notification-model')
const Image = require('../models/image-model')
const ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const nodemailer = require("nodemailer");
const emailUtil = require("../utils/emails");
const cloudinary = require("../config/cloudinary");
const config = require("config");
const Map = require('../models/map-model');
const Tileset = require('../models/tileset-model');
const Tile = require('../models/tile-model');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.get("email_address"),
        pass: config.get("app_password"),
    },
});

getLoggedIn = async (req, res) => {
    auth.verifyToken(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: loggedInUser
        });
    })
}

loginUser = async (req, res) => {
    try {
        const { email, password } = req.query;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Please enter all required fields." });
        }

        const foundUser = await User.findOne({ email: email });
        if (!foundUser) {
            return res.status(400).json({ message: "A User with the email provided does not exist." });
        }

        const match = await bcrypt.compare(password, foundUser.passwordHash);
        if (match) {
            const token = auth.signToken(foundUser);

            res.cookie("token", token, {
                httpOnly: true,
                //sameSite: 'none',
                maxAge: 6.048e+8
            })

            // return res.json({ status: 'OK' });

            //res.set("Set-Cookie", [
            //`token=${token}; HttpOnly; Secure; SameSite=none; Max-Age=86400`,
            //]);
            res.status(200).json({
                success: true,
                user: foundUser,
            });
            console.log("cookies", res.cookies)
            return res;
        }
        else {
            return res.status(400).json({ message: "Wrong password entered." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500);
    }
}

logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0
    });
    return res.status(200).json({ success: true });
}

getAllUsers = async (req, res) => {
    const users = await User.find();
    return res.status(200).json({
        users: users
    });
}

getUserbyId = async (req, res) => {
    const savedUser = await User.findById(req.params.id);
    return res.status(200).json({
        user: savedUser
    });
}

getUserFriends = async (req, res) => {
    const savedUser = await User.findById(req.params.id);
    const friends = savedUser.friends
    let returnFriends = []
    for (let i = 0; i < friends.length; i++) {
        findFriend = await User.findById(mongoose.Types.ObjectId(friends[i]))
        returnFriends.push(findFriend)
    }
    return res.status(200).json({
        success: true,
        friends: returnFriends
    });
}

getUserbyUsername = async (req, res) => {
    const savedUser = await User.findOne({ userName: req.params.username });
    return res.status(200).json({
        user: savedUser
    });
}

getUsersbyUsername = async (req, res) => {
    const savedUsers = await User.find({ userName: req.params.username });
    return res.status(200).json({
        success: true,
        users: savedUsers
    });
}

forgotPassword = async (req, res) => {
    console.log('atleast here')
    try {
        const { email } = req.query;

        if (!email)
            return res
                .status(400)
                .json({
                    message: "ERROR (email)!"
                });

        const user = await User.findOne({ email: email });
        if (!user)
            return res
                .status(400)
                .json({
                    message: "ERROR (no user found)!"
                });

        // NOTE generated tokens expire in 15 minutes
        const token = auth.signPasswordResetToken(user);

        const mailOptions = {
            from: config.get("email_address"),
            to: email,
            subject: "Reset Your Pieces Password",
            text: emailUtil.generatePasswordResetEmailText(email, user._id, token),
            html: emailUtil.generatePasswordResetEmailHTML(email, user._id, token),
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return "ERROR";
            } else {
                console.log(`Email sent: ${info.response}`);
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Reset email sent!'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send();
    }
}




updateUser = async (req, res) => {
    try {
        console.log(req.body)
        const { id, firstName, lastName, userName, email, bio } = req.body;
        const ObjId = new ObjectId(id);


        const alreadyRegistered = await User.findOne({ $and: [{ email: email }, { _id: { $ne: ObjId } }] });
        if (alreadyRegistered) {
            return res
                .status(400)
                .json({
                    message: "User with that email already registered."
                });
        }


        await User.findOneAndUpdate({ email: email }, {
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            bio: bio
        }, { returnOriginal: false }).then((newUser) => {
            return res.status(200).json({
                success: true,
                user: newUser,
                message: 'User has been updated!'
            })
        }).catch((err) => {
            console.log(err)
            return res.status(404).json({
                success: false,
                message: 'Failed to update user'
            })
        });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password, passwordVerify, } = req.body;

        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ message: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    message: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    message: "Please enter the same password twice."
                })
        }



        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "An account with this email address already exists."
                })
        }

        const existingUser2 = await User.findOne({ userName: userName });
        if (existingUser2) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "An account with this User Name already exists."
                })
        }



        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        const notifications = [];
        const friends = [];
        const chats = [];
        const bio = '';
        //const key = crypto.randomBytes(20).toString('hex');


        const newUser = new User({
            firstName, lastName, userName, email, passwordHash, notifications, bio, friends, chats
        });
        await newUser.save().then(() => {
            //sendVerification(email, key);
            return res.status(200).json({
                success: true,
                user: newUser,
                message: 'User has been registered!'
            })
        }).catch((err) => {
            console.log(err)
            return res.status(404).json({
                success: false,
                message: 'Failed to register user'
            })
        });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }

}

changePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword, repeatNewPassword } = req.body;

        if (!email || !currentPassword || !newPassword)
            return res
                .status(400)
                .json({ message: "Must Provide All Required Arguments to Change Password!" });

        if (newPassword !== repeatNewPassword)
            return res
                .status(400)
                .json({
                    message: "New Password Must Match!"
                });

        const user = await User.findOne({ email: email });
        if (!user)
            return res
                .status(400)
                .json({
                    message: "Account With Specified Email Not Found!"
                });

        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid)
            return res
                .status(400)
                .json({
                    message: "Incorrect Current Password. Please Try Again!"
                });

        if (currentPassword === newPassword && newPassword === repeatNewPassword)
            return res
                .status(400)
                .json({
                    message: "Can Not Change to Same Password!"
                });

        newPasswordHash = await bcrypt.hash(newPassword, 10);
        await user.updateOne({ passwordHash: newPasswordHash }).then(() => {
            return res.status(200).json({
                success: true,
                user: user,
                message: 'User password has been changed!'
            })
        }).catch((err) => {
            console.log(err)
            return res.status(404).json({
                success: false,
                message: 'Failed to change password'
            })
        });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


resetPassword = async (req, res) => {
    try {
        const { id, token, password, repeatPassword } = req.body;

        if (!id || !token || !password)
            return res
                .status(400)
                .json({ message: "Must Provide All Required Arguments to Change Password!" });

        if (password !== repeatPassword)
            return res
                .status(400)
                .json({
                    message: "New Password Must Match!"
                });

        const objectId = new ObjectId(id);
        const user = await User.findOne({ _id: objectId });
        if (!user)
            return res
                .status(400)
                .json({ message: "Account with specified id not found." });

        const payload = auth.verifyPasswordResetToken(user, token);

        if (!payload)
            return res
                .status(400)
                .json({ message: "Token is invalid or expired." });


        newPasswordHash = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate({ _id: objectId }, { passwordHash: newPasswordHash }).then(() => {
            return res.status(200).json({
                success: true,
                message: 'User password has been reset!'
            })
        }).catch((err) => {
            console.log(err)
            return res.status(404).json({
                success: false,
                message: 'Failed to reset password'
            })
        });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


addFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        if (!friendId || !userId)
            return res
                .status(400)
                .json({ message: "Must provide Ids of both users!" });


        if (friendId === userId)
            return res
                .status(400)
                .json({ message: "Cannot add yourself as friend!" });


        const objectUserId = new ObjectId(userId);
        const user = await User.findOne({ _id: objectUserId });
        if (!user)
            return res
                .status(400)
                .json({ message: "Account with specified id not found (current user)." });

        const objectFriendId = new ObjectId(friendId);
        const friend = await User.findOne({ _id: objectFriendId });
        if (!friend)
            return res
                .status(400)
                .json({ message: "Account with specified id not found (friend)." });

                
        if (user.friends.includes(friendId)) {
            return res.status(400).json({
                success: false,
                message: "You are already friends!"
            })
        }

        if (friend.friends.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You are already friends!"
            })
        }

        friend.friends.push(userId);
        await friend.save()

        user.friends.push(friendId);
        await user.save().then(() => {
            return res.status(200).json({
                success: true,
                user: user,
                message: 'Friend added!'
            })
        }).catch((err) => {
            console.log(err)
            return res.status(404).json({
                success: false,
                message: 'Failed to add friends'
            })
        });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

removeFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        if (!friendId || !userId)
            return res
                .status(400)
                .json({ message: "Must provide Ids of both users!" });
        if (friendId === userId)
            return res
                .status(400)
                .json({ message: "Cannot add yourself as friend!" });

        const objectUserId = new ObjectId(userId);
        const user = await User.findOne({ _id: objectUserId });
        if (!user)
            return res
                .status(400)
                .json({ message: "Account with specified id not found (current user)." });
        const objectFriendId = new ObjectId(friendId);
        const friend = await User.findOne({ _id: objectFriendId });
        if (!friend)
            return res
                .status(400)
                .json({ message: "Account with specified id not found (friend)." });

        if (!(user.friends.includes(friendId))) {
            return res.status(400).json({
                success: false,
                message: "You are not friends!"
            })
        }
        friend.friends = friend.friends.filter(id => id !== userId)
        await friend.save()

        user.friends = user.friends.filter(id => id !== friendId)
        await user.save().then(() => {
            return res.status(200).json({
                success: true,
                user: user,
                message: 'Friend removed!'
            })
        }).catch((err) => {
            console.log(err)
            return res.status(404).json({
                success: false,
                message: 'Failed to remove friend'
            })
        });

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


getOwnerAndCollaboratorOfMaps = async (req, res) => {

    const { id } = req.query;

    if (!id) {
        return res
            .status(400)
            .json({ message: "Must Provide All Required Arguments to Get Owner and Collaborators of Maps" });
    }

    var uid;
    try {
        uid = new ObjectId(id);
    } catch (err) {
        return res
            .status(400)
            .json({ message: "Invalid User ID" });
    }

    const owner = await Map.find({ ownerId: uid });
    const collaborator = await Map.find({ collaboratorIds: { $elemMatch: { $eq: uid } } });

    const aggregation = [
        // get all maps that are in the user's favorites but not owned by the user and the user is not a collaborator
        {
            $match: {
                $and: [
                    { collaboratorIds: { $nin: [uid] } },
                    { ownerId: { $ne: uid } },
                    { favs: { $in: [uid] } },
                ],
            },
        },
    ];

    const favs = await Map.aggregate(aggregation);

    return res.status(200).json({
        success: true,
        owner: owner,
        collaborator: collaborator,
        favs: favs,
        message: 'Owner and Collaborators of Maps have been retrieved'
    })
}


getLibraryMapsByName = async (req, res) => {
    const { id, name } = req.query;

    if (!id) {
        return res
            .status(400)
            .json({ message: "Must Provide All Required Arguments to Get Owner and Collaborators of Maps" });
    }

    var uid;
    try {
        uid = new ObjectId(id);
    } catch (err) {
        return res
            .status(400)
            .json({ message: "Invalid User ID" });
    }

    const owner = await Map.find({ ownerId: uid });
    let filteredOwner = owner.filter(function (str) { return str.title.toUpperCase().includes(name.toUpperCase()) });

    // let filteredOwner = owner.filter(obj => {
    //     return obj.title.includes(name)
    //   });

    //   console.log(filteredOwner)

    const collaborator = await Map.find({ collaboratorIds: { $elemMatch: { $eq: uid } } });
    let filteredCollaborator = collaborator.filter(function (str) { return str.title.toUpperCase().includes(name.toUpperCase()) });

    const aggregation = [
        // get all maps that are in the user's favorites but not owned by the user and the user is not a collaborator
        {
            $match: {
                $and: [
                    { collaboratorIds: { $nin: [uid] } },
                    { ownerId: { $ne: uid } },
                    { favs: { $in: [uid] } },

                ],
            },
        },
    ];

    const favs = await Map.aggregate(aggregation);
    filteredFavs = favs.filter(function (str) { return str.title.toUpperCase().includes(name.toUpperCase()) });

    return res.status(200).json({
        success: true,
        owner: filteredOwner,
        collaborator: filteredCollaborator,
        favs: filteredFavs,
        message: 'Owner and Collaborators of Maps have been retrieved'
    })
}

var getUserFavorites = async (req, res) => {
    const { id } = req.query;
    var { filteredId } = req.query;
    var { tileHeight, tileWidth } = req.query;

    if (!id || !tileHeight || !tileWidth) {
        return res
            .status(400)
            .json({ message: "Must Provide All Required Arguments to Get User Favorites" });
    }

    if (Number.isNaN(+tileHeight) || Number.isNaN(+tileWidth)) {
        return res
            .status(400)
            .json({ message: "Tile Height and Tile Width must be numbers" });
    }

    tileHeight = +tileHeight;
    tileWidth = +tileWidth;

    var uid;
    var fid;
    try {
        uid = mongoose.Types.ObjectId(id);
        if (filteredId) {
            fid = mongoose.Types.ObjectId(filteredId);
        }
    } catch (err) {
        return res
            .status(400)
            .json({ message: "Invalid User ID" });
    }

    var aggregation;
    if (!fid) {
        console.log('doing fid')
        aggregation = [
            // get all maps that are in the user's favorites but not owned by the user and the user is not a collaborator
            {
                $match: { $or: [
                    { $and: [
                        {favs: { $in: [uid] }},
                        {ownerId: { $ne: uid }},
                    ]},
                    { $and: [
                        {favs: { $in: [uid] }},
                        {isPublic: true}
                        ] },
                    { ownerId: uid },
                    { $and: [
                        {favs: { $in: [uid] }},
                        {collaboratorIds: { $in: [uid] }}
                        ]
                    },
                ],
                "tileHeight": tileHeight,
                "tileWidth": tileWidth }
            }
        ];
    } else {
        console.log('not doing fid')
        aggregation = [
            // get all maps that are in the user's favorites but not owned by the user and the user is not a collaborator
            {
                $match: {
                    $or: [
                        { $and: [
                            {favs: { $in: [uid] }},
                            {ownerId: { $ne: uid }},
                        ]},
                        { $and: [
                            {favs: { $in: [uid] }},
                            {isPublic: true}
                            ] },
                        { ownerId: uid },
                        { $and: [
                            {favs: { $in: [uid] }},
                            {collaboratorIds: { $in: [uid] }}
                            ]
                        },
                    ],
                    _id: { $ne: fid },
                    "tileHeight": tileHeight,
                    "tileWidth": tileWidth
                },
            },
        ];
    }

    const maps = await Map.aggregate(aggregation);
    const tilesets = await Tileset.aggregate(aggregation);

    console.log(id, filteredId, tileHeight, tileWidth)
    console.log(maps)
    console.log(tilesets)
    return res.status(200).json({
        success: true,
        maps: maps,
        tilesets: tilesets,
        message: 'User Favorites have been retrieved'
    })
}


deleteUser = async (req, res) => {

    const { id } = req.body
    console.log(id)

    var uid;
    try {
        uid = new ObjectId(id);
    } catch (err) {
        return res
            .status(400)
            .json({ message: "Invalid User ID" });
    }

    const user = await User.findById(uid);


    if (!user)
        return res
            .status(400)
            .json({
                message: "Account does not exist Not Found!"
            });


    // Collaborator projects
    // Remove Map Collaborator
    const collaboratorMaps = await Map.find({ collaboratorIds: { $elemMatch: { $eq: uid } } });

    collaboratorMaps.forEach((collabMap) => {
        collabMap.collaboratorIds.remove(uid);
        collabMap.save().then((map) => {
            //console.log(map)
        })
            .catch((err) => {
                return res.status(400).json({
                    success: false,
                    message: "Error removing user from Map collaborator",
                    error: err
                })
            })
    })


    // Remove Tileset Collaborator
    const collaboratorTilesets = await Tileset.find({ collaboratorIds: { $elemMatch: { $eq: uid } } });

    collaboratorTilesets.forEach((collabTileset) => {
        collabTileset.collaboratorIds.remove(uid);
        collabTileset.save().then((tileset) => {
            //console.log(tileset)
        })
            .catch((err) => {
                return res.status(400).json({
                    success: false,
                    message: "Error removing user from Tileset collaborator",
                    error: err
                })
            })
    })


    // Owned projects 
    // 1. Collaborators exist = give first collaborator ownership

    // Maps
    const ownedCollabMaps = await Map.find({ collaboratorIds: { $exists: true, $type: 'array', $ne: [] } })
    console.log(ownedCollabMaps)
    ownedCollabMaps.forEach((map) => {
        var newOwner = map.collaboratorIds[0];
        map.ownerId = newOwner;
        map.collaboratorIds.remove(newOwner);
        map.save().then((newmap) => {
            console.log(newmap)
        })
            .catch((err) => {
                return res.status(400).json({
                    success: false,
                    message: "Error changing owner rights",
                    error: err
                })
            })
    })



    // Tilesets
    const ownedCollabTilesets = await Tileset.find({ collaboratorIds: { $exists: true, $type: 'array', $ne: [] } })
    ownedCollabTilesets.forEach((tile) => {
        var newOwner = tile.collaboratorIds[0];
        tile.ownerId = newOwner;
        tile.collaboratorIds.remove(newOwner);
        tile.save().then((newtile) => {
            //console.log(newtile)
        })
            .catch((err) => {
                return res.status(400).json({
                    success: false,
                    message: "Error changing owner rights",
                    error: err
                })
            })
    })


    // 2. No collaborators = delete 
    // Map
    const noCollabOwned = await Map.deleteMany({ ownerId: uid, collaboratorIds: { $exists: true, $type: 'array', $eq: [] } })
    //console.log(noCollabOwned)

    // Tileset & Tiles
    // if deleting tileset, then remove tiles as well
    const tilesets = await Tileset.find({ ownerId: uid, collaboratorIds: { $exists: true, $type: 'array', $eq: [] } })

    tilesets.forEach(async function (tileset) {
        var tilesetId = tileset._id;
        await Tile.deleteMany({ tilesetId: tilesetId })
    })

    await Tileset.deleteMany({ ownerId: uid, collaboratorIds: { $exists: true, $type: 'array', $eq: [] } })

    // everything about threads, owned threads, replies, likes, dislikes, comments
    // NO NEED ^ because will show up as deletedUser

    // TODO: remove all friends
    // TODO: remove all chats
    // TODO: remove all notifications

    // delete image from cloudinary
    if (user.profilePic && user.profilePic.publicId) {
        const res = await cloudinary.v2.uploader.destroy(user.profilePic.publicId);
        console.log(res)
        if (res.result !== "ok") throw new Error();
    }

    const img = {
        publicId: "",
        url: ""
    };

    await User.findOneAndUpdate({ _id: uid }, { $set: { profilePic: img } },
        { new: true }).then((newUser) => {
            // console.log(newUser)
        }).catch((err) => {
            console.log(err)
            return res.status(404).json({
                success: false,
                message: 'Failed to delete profilepic'
            })
        });

    // Rename user firstname, lastname, username to deleteduser
    // clear bio, change password
    await User.findOneAndUpdate({ _id: uid },
        {
            firstName: "DELETED",
            lastName: "USER",
            userName: "DeletedUser",
            bio: "",
            passwordHash: ""
        }, { returnOriginal: false }).then((newUser) => {
            return res.status(200).json({
                success: true,
                user: newUser,
                message: 'User deleted!'
            })
        }).catch((err) => {
            console.log(err)
            return res.status(404).json({
                success: false,
                message: 'Failed to delete profilepic'
            })
        });
}


uploadImage = async (req, res) => {
    try {
        const { id, publicId, url } = req.body;

        var objId = new ObjectId(id);

        const img = {
            publicId,
            url
        };

        const user = await User.findById(objId);

        // delete previous pic if any
        if (user.profilePic && user.profilePic.publicId) {
            const res = await cloudinary.v2.uploader.destroy(user.profilePic.publicId);
            console.log(res)
            if (res.result !== "ok") throw new Error();
        }

        await User.findOneAndUpdate({ _id: objId }, { $set: { profilePic: img } },
            { new: true }).then((newUser) => {
                return res.status(200).json({
                    success: true,
                    user: newUser,
                    message: 'User profile pic has been updated!'
                })
            }).catch((err) => {
                console.log(err)
                return res.status(404).json({
                    success: false,
                    message: 'Failed to update profilepic'
                })
            });

    } catch (err) {
        console.error(err);
        return res.status(500);
    }
},


    deleteImage = async (req, res) => {
        try {
            const { id, publicId } = req.body;

            var objId = new ObjectId(id);

            const img = {
                publicId: "",
                url: ""
            };

            const user = await User.findById(objId);


            // check if req publicId correct,
            // & user has an image 
            if (publicId !== "" && user.profilePic && user.profilePic.publicId &&
                publicId === user.profilePic.publicId) {
                const res = await cloudinary.v2.uploader.destroy(publicId);
                if (res.result !== "ok") throw new Error();
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Failed to delete image in cloudinary'
                })
            }

            await User.findOneAndUpdate({ _id: objId }, { $set: { profilePic: img } },
                { new: true }).then((newUser) => {
                    return res.status(200).json({
                        success: true,
                        user: newUser,
                        message: 'User profile pic has been deleted!'
                    })
                }).catch((err) => {
                    console.log(err)
                    return res.status(404).json({
                        success: false,
                        message: 'Failed to delete profilepic'
                    })
                });

        } catch (err) {
            console.error(err);
            return res.status(500);
        }
    },

    module.exports = {
        getLoggedIn,
        registerUser,
        loginUser,
        logoutUser,
        getUserbyId,
        getUserFriends,
        getUserbyUsername,
        updateUser,
        changePassword,
        forgotPassword,
        resetPassword,
        getOwnerAndCollaboratorOfMaps,
        getLibraryMapsByName,
        getUserFavorites,
        getUsersbyUsername,
        getAllUsers,
        uploadImage,
        deleteImage,
        deleteUser,
        addFriend,
        removeFriend
    }
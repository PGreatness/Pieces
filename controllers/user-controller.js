const auth = require('../auth/tokens');
const User = require('../models/user-model')
const Notification = require('../models/notification-model')
const Image = require('../models/image-model')
const ObjectId = require("mongoose").Types.ObjectId;
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");
const emailUtil = require("../utils/emails");
const config = require("config");

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
        }).send();
    })
}

loginUser = async (req, res) => {
    try {
        const { userName, password } = req.query;
        console.log("username and password")
        console.log(userName, password)
        if (userName === "Community" || userName === "Guest") {
            return res.status(400).json({ message: "You cannot login with this userName" });
        }

        const foundUser = await User.findOne({ userName: userName });
        if (!foundUser) {
            return res.status(400).json({ message: "A User with the username provided does not exist." });
        }

        const match = await bcrypt.compare(password, foundUser.passwordHash);
        if (match) {
            const token = auth.signToken(foundUser);
            console.log("token", token)

            res.set("Set-Cookie", [
                `token=${token}; HttpOnly; Secure; SameSite=none; Max-Age=86400`,
            ]);
            res.status(200).json({
                success: true,
                user: foundUser,
            }).send();
            console.log("cookies", res.cookies)
            return res;
        }
        else {
            return res.status(400).json({ message: "Wrong password entered." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
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


getUserbyId = async (req, res) => {
    const savedUser = await User.findById(req.params.id);
    return res.status(200).json({
        user: savedUser
    }).send();
}

getUserbyUsername = async (req, res) => {
    const savedUser = await User.findOne({ userName: req.params.username });
    return res.status(200).json({
        user: savedUser
    }).send();
}

forgotPassword = async (req, res) => {
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
        res.status(500).send();
    }
}




updateUser = async (req, res) => {
    try {
        console.log(req.body)
        const { _id, firstName, lastName, userName, email, bio } = req.body;


        const alreadyRegistered = await User.findOne({ $and: [{ email: email }, { _id: { $ne: _id } }] });
        if (alreadyRegistered) {
            return res
                .status(400)
                .json({
                    message: "User with that email already registered."
                });
        }


        const user = await User.findById(_id);
        await user.updateOne({
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            bio: bio
        }).then(() => {
            return res.status(200).json({
                success: true,
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
        if (userName === "Community" || userName === "Guest") {
            return res
                .status(400)
                .json({
                    message: "An account with this User Name already exists."
                })
        }
        if (email === "community@pieces.com" || email === "guestuser@pieces.com") {
            return res
                .status(400)
                .json({
                    message: "An account with this email address already exists."
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
        await User.findOneAndUpdate({ email }, { passwordHash: newPasswordHash }).then(() => {
            return res.status(200).json({
                success: true,
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
        const { id, token, password } = req.body;

        if (!id || !token || !password)
            return res
                .status(400)
                .json({ message: "Must Provide All Required Arguments to Change Password!" });

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
        await User.findOneAndUpdate({ id }, { passwordHash: newPasswordHash }).then(() => {
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

var getOwnerAndCollaboratorOfMaps = async (req, res) => {

    const { id } = req.query;

    if (!id) {
        return res
            .status(400)
            .json({ message: "Must Provide All Required Arguments to Get Owner and Collaborators of Maps" });
    }

    var uid;
    try {
        uid = ObjectId(id);
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


module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getUserbyId,
    getUserbyUsername,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
    getOwnerAndCollaboratorOfMaps
}
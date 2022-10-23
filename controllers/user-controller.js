const auth = require('../auth/tokens');
const User = require('../models/user-model')
const Notification = require('../models/notification-model')
const Image = require('../models/image-model')
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");
//const tokens = require("../utils/tokens");
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
        if (userName === "Community" || userName === "Guest") {
            return res.status(400).json({ errorMessage: "You cannot login with this userName" });
        }

        const foundUser = await User.findOne({ userName: userName });
        if (!foundUser) {
            return res.status(400).json({ errorMessage: "A User with the username provided does not exist." });
        }

        const match = await bcrypt.compare(password, foundUser.passwordHash);
        if (match) {
            const token = auth.signToken(foundUser);

            await res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            }).status(200).json({
                success: true,
                user: foundUser
            }).send();
        }
        else {
            return res.status(400).json({ errorMessage: "Wrong password entered." });
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




// updateUser = async (_, { _id: id, update }) => {
//     const _id = new ObjectId(id);
//     try {
//         await User.findOneAndUpdate({ _id }, { $set: update }, { new: true });
//         return true;
//     } catch (error) {
//         console.log(error);
//         throw new Error("There was an error updating the fields");
//     }
// }

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password, passwordVerify, } = req.body;

        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        if (userName === "Community" || userName === "Guest") {
            return res
                .status(400)
                .json({
                    errorMessage: "An account with this User Name already exists."
                })
        }
        if (email === "community@pieces.com" || email === "guestuser@pieces.com") {
            return res
                .status(400)
                .json({
                    errorMessage: "An account with this email address already exists."
                })
        }


        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const existingUser2 = await User.findOne({ userName: userName });
        if (existingUser2) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this User Name already exists."
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
                .json({ errorMessage: "Must Provide All Required Arguments to Change Password!" });

        if (newPassword !== repeatNewPassword)
            return res
                .status(400)
                .json({
                    errorMessage: "New Password Must Match!"
                });

        const user = await User.findOne({ email: email });
        if (!user)
            return res
                .status(400)
                .json({
                    errorMessage: "Account With Specified Email Not Found!"
                });

        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid)
            return res
                .status(400)
                .json({
                    errorMessage: "Incorrect Current Password. Please Try Again!"
                });

        if (currentPassword === newPassword && newPassword === repeatNewPassword)
            return res
                .status(400)
                .json({
                    errorMessage: "Can Not Change to Same Password!"
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

forgotPassword = async (req, res) => {
    try {
        const { email } = args;

        if (!email) 
        return res
        .status(400)
        .json({
            errorMessage: "ERROR (email)!"
        });

        const user = await User.findOne({ email: email });
        if (!user) 
        return res
        .status(400)
        .json({
            errorMessage: "ERROR (no user found)!"
        });

        // NOTE generated tokens expire in 15 minutes
        const token = auth.signPasswordResetToken(user);

        const mailOptions = {
            from: "imanali4@gmail.com",
            to: email,
            subject: "Reset Your Pieces Password",
            text: emailUtil.generateEmailText(email, user._id, token),
            html: emailUtil.generateEmailHTML(email, user._id, token),
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return "ERROR";
            } else {
                console.log(`Email sent: ${info.response}`);
            }
        });

        return "OK";
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

resetPassword = async (req, res) => {
    try {
        const { id, token, password } = args;

        if (!id || !token || !password)
            return res
                .status(400)
                .json({ errorMessage: "Must Provide All Required Arguments to Change Password!" });

        const objectId = new ObjectId(id);
        const user = await User.findOne({ _id: objectId });
        if (!user)
            return res
                .status(400)
                .json({ errorMessage: "Account with specified id not found." });

        const payload = auth.verifyPasswordResetToken(user, token);

        if (!payload)
            return res
                .status(400)
                .json({ errorMessage: "Token is invalid or expired." });

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



module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getUserbyId,
    getUserbyUsername,
    changePassword
}
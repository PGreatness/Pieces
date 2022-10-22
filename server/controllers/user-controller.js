const auth = require('../auth')
const User = require('../models/user-model')
const Notification = require('../models/notification-model')
const Image = require('../models/image-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    auth.verify(req, res, async function () {
        const loggedInUser = await User.findOne({ _id: req.userId });
        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser?.firstName,
                lastName: loggedInUser?.lastName,
                userName: loggedInUser?.userName,
                isGuest: (loggedInUser?.userName === "Guest")
            }
        }).send();
    })
}

registerUser = async (req, res) => {}
loginUser = async (req, res) => {}
loginGuest = async (req, res) => {}

logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0 
    }); 
    return res.status(200).json({success: true}); 
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    loginGuest,
    logoutUser
}
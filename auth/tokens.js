const jwt = require("jsonwebtoken")
const config = require("config")

function authManager() {
    verifyToken = function (req, res, next) {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({
                    loggedIn: false,
                    user: null,
                    errorMessage: "Unauthorized"
                })
            }

            const verified = jwt.verify(token, config.get("secrets.access_token"))
            req.userId = verified.userId;

            next();
        } catch (err) {
            console.error(err);
            return res.status(401).json({
                errorMessage: "Unauthorized"
            });
        }
    };

    signToken = function (user) {
        return jwt.sign({ userId: user._id }, config.get("secrets.access_token"), { expiresIn: "1h" });
    };

    verifyPasswordResetToken = function (user, token) {
        const secret = config.get("secrets.jwt") + req.user.password;
        try {
            return jwt.verify(token, secret);
        } catch (e) {
            return null;
        }
    };

    signPasswordResetToken = function (user) {
        const secret = config.get("secrets.jwt") + user.passwordHash;
        return jwt.sign({ userId: user._id, email: user.email }, secret, { expiresIn: "15min" });
    };


    return this;
}

const auth = authManager();
module.exports = auth;
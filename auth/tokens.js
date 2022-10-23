const jwt = require("jsonwebtoken")

function authManager() {
    verify = function (req, res, next) {
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
    }

    signToken = function (user) {
        return jwt.sign({ userId: user._id }, config.get("secrets.access_token"), { expiresIn: "1h" });
    };

    return this;
}

const auth = authManager();
module.exports = auth;
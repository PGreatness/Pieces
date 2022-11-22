const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: "pieces416",
    api_key: "845223412136326",
    api_secret: "zchssVhve5RkrR7bo0JoLA4vaUY",
});

module.exports = cloudinary;
const { Server } = require("socket.io");

const startWebSockets = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        },
    });
    io.on("connect", (socket) => {
        console.log("a user connected");

        socket.on("login", (user) => {
            console.log("user logged in");
            console.log(`joining room ${user}`)
            socket.join(user);
        });

        socket.on("logout", (user) => {
            console.log("user logged out");
            socket.leave(user);
        });

        socket.on("disconnect", () => {
            console.log("user disconnected");
        });

        socket.on("collaboratorAdded", (data) => {
            console.log("map collaborator added");
            socket.to(data.sendTo).emit("updateNotifications");
        });

        socket.on("addFriend", (data) => {
            console.log("friend request sent");
            console.log(`Sending to ${data.sendTo}`)
            socket.to(data.sendTo).emit("updateNotifications");
        })
    });
}

module.exports = startWebSockets;
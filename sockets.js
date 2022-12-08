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
            socket.user = user;
            socket.join(user);
        });

        socket.on("logout", (user) => {
            console.log("user logged out");
            socket.user = null;
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

        socket.on("friendRequestAction", (data) => {
            console.log("friend request action");
            console.log(`Sending to ${data.sendTo} from ${socket.user}`)
            socket.to(data.sendTo).emit("friendRequestResponse", { from: socket.user, action: data.action } );
            console.log("friend request response sent");
            socket.to(data.sendTo).emit("updateNotifications");
            console.log('updating notifications...');
        });

        socket.on('requestUpdate', (data) => {
            console.log('requesting update to notifications...');
            socket.to(data.sendTo).emit('updateNotifications');
            console.log('update sent');
        })
    });
}

module.exports = startWebSockets;
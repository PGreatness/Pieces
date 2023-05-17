const { Server } = require("socket.io");

const startWebSockets = (server) => {
    const io = new Server(server, {
        cors: {

            origin: process.env.PUBLIC_URL || "http://localhost:3000",

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
            socket.to(data.sendTo).emit("updateNotifications", { socketId: socket.id });
        });

        socket.on("addFriend", (data) => {
            console.log("friend request sent");
            console.log(`Sending to ${data.sendTo}`)
            socket.to(data.sendTo).emit("updateNotifications", { socketId: socket.id });
        })

        socket.on("friendRequestAction", (data) => {
            console.log("friend request action");
            console.log(`Sending to ${data.sendTo} from ${socket.user}`)
            socket.to(data.sendTo).emit("friendRequestResponse", { from: socket.user, action: data.action } );
            console.log("friend request response sent");
        });

        socket.on('requestUpdate', (data) => {
            console.log(`requesting update to notifications from ${socket.user} to ${data.sendTo}, currently ${socket.id}`);
            console.log([...socket.rooms])
            console.log([...socket.rooms].includes(data.sendTo))
            socket.emit("updateNotifications", { socketId: socket.id });
            console.log('update sent');
        })

        socket.on('openProject', (data) => {
            console.log(`opening project ${data.project} for ${socket.user}`);
            // join the project room
            socket.join(data.project);
        });

        socket.on('closeProject', (data) => {
            console.log(`closing project ${data?.project} for ${socket.user}`);
            // leave the project room
            try {
                socket.leaveAll();
                socket.join(socket.user);
            } catch (e) {
                console.log(e);
                console.log("No project to leave");
            }
        });

        socket.on('updateMap', (data) => {
            console.log('a collaborator updated the map, pushing update to all collaborators');
            console.log(data);
            socket.to(data.project).emit('recieveUpdateMap', {...data, socketId: socket.id});
        })

        socket.on('updateTileset', (data) => {
            console.log('a collaborator updated the tileset, pushing update to all collaborators');
            socket.broadcast.to(data.project).emit('recieveUpdateTileset', {...data, socketId: socket.id});
        })

        socket.on('requestViewportMove', (data) => {
            console.log('requesting moving of viewport through arrow buttons');
            console.log(data);
            // emit a message to self
            socket.emit('moveViewport', {...data, socketId: socket.id});
        })

    });
}

module.exports = startWebSockets;

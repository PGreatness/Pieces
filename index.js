// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const config = require("config");
const path = require('path');
const sockets = require('./sockets');

// CREATE OUR SERVER
const PORT = process.env.PORT || 4000;
const app = express()

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const piecesRouter = require('./routes/pieces-router')



// For local testing
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api', piecesRouter);





// For production build
if (process.env.NODE_ENV === "production") {

    // SETUP THE MIDDLEWARE
    app.use(express.urlencoded({ extended: true }))
    app.use(cors({
        origin: [process.env.PUBLIC_URL || "https://pieces-316.herokuapp.com/"],
        credentials: true
    }))
    //"http://pieces-316.herokuapp.com", 
    app.use(express.json())
    app.use(cookieParser())

    app.use('/api', piecesRouter);


    // app.use(express.static("client/build"));
    // app.get("*", (req, res) => {
    //   res.sendFile(path.resolve(__dirname,  "/client/build", "index.html"));
    // });
}

const serverRouter = require('./routes/server-router');
app.use('/', serverRouter);

// CONNECT TO DATABASE
mongoose.connect(config.get("mongo_uri"), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        var server = app.listen({ port: PORT }, () => {
            console.log(`Server is running on port ${PORT}`)
        });
        sockets(server);
    })
    .catch(error => {
        console.log(error)
    });

// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const config = require("config");
const path = require('path')

// CREATE OUR SERVER
const PORT = process.env.PORT || 4000;
const serverDomain = "localhost";
const app = express()

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const piecesRouter = require('./routes/pieces-router')

if (process.env.NODE_ENV === "production") {

    // SETUP THE MIDDLEWARE
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())
    app.use(express.json())
    app.use(cookieParser())

    app.use('/api', piecesRouter);


    // app.use(express.static("client/build"));
    // app.get("*", (req, res) => {
    //   res.sendFile(path.resolve(__dirname,  "/client/build", "index.html"));
    // });
}

app.use('/*', express.static(path.join(__dirname + '/public')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "/public", "index.html"))
});

// CONNECT TO DATABASE
mongoose.connect(config.get("mongo_uri"), { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen({ port: PORT }, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    })
    .catch(error => {
        console.log(error)
    });
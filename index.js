// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const config = require("config");

// CREATE OUR SERVER
const PORT = config.get('port') || 4000;
const serverDomain = "localhost";
const app = express()

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const piecesRouter = require('./routes/pieces-router')
app.use('/api', piecesRouter)

// SETUP THE MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname,  'client', "build", "index.html"));
    });
  }

// CONNECT TO DATABASE
mongoose.connect(config.get("mongo_uri"), {useNewUrlParser: true , useUnifiedTopology: true})
    .then(() => {
        app.listen({ port: PORT, host: '0.0.0.0' }, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    })
    .catch(error => {
        console.log(error)
    });
// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const config = require("config");

// CREATE OUR SERVER
const PORT = config.get('port') || 5000;
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
    app.use(express.static("build"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname,  "build", "index.html"));
    });
  }

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const piecesRouter = require('./routes/pieces-router')
app.use('/api', piecesRouter)

// CONNECT TO DATABASE
mongoose.connect(config.get("mongo_uri"), {useNewUrlParser: true , useUnifiedTopology: true})
    .then(() => {
        app.listen({ port: PORT }, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    })
    .catch(error => {
        console.log(error)
    });
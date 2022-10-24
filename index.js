// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const config = require("config");

// CREATE OUR SERVER
const PORT = config.get('port') || 5000;
const serverDomain = "https://pieces-316.herokuapp.com";
const app = express()

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const piecesRouter = require('./routes/pieces-router')
app.use('/api', piecesRouter)

// SETUP THE MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ["http://pieces-316.herokuapp.com", "https://pieces-316.herokuapp.com", config.get("server_local_domain")],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/test', (req, res) => {
    res.send("Hello World!")
})

// CONNECT TO DATABASE
mongoose.connect(config.get("mongo_uri"), {useNewUrlParser: true , useUnifiedTopology: true})
    .then(() => {
        app.listen({ port: PORT }, () => {
            console.log(`Server ready at ${serverDomain}:${PORT}`);
        })
    })
    .catch(error => {
        console.log(error)
    });
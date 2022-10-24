// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const config = require("config");

// CREATE OUR SERVER
const PORT = config.get("port");
const serverDomain = config.get("server_local_domain");
const app = express()

// SETUP THE MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: [config.get("client_origin"), "http://pieces-316.herokuapp.com", "https://pieces-316.herokuapp.com"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const piecesRouter = require('./routes/pieces-router')
app.use('/api', piecesRouter)

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


 /* 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/api', (req, res) => {
    res.send(__dirname + '/public/index.html')
}) */
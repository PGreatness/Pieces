const auth = require('../auth')
const express = require('express')
const UserController = require('../controllers/user-controller')

const router = express.Router()

router.post('/register', UserController.registerUser)
router.get('/loggedIn', UserController.getLoggedIn)
router.get('/login/', UserController.loginUser)
router.get('/logout/', UserController.logoutUser)


module.exports = router
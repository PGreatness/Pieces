const express = require('express')
const UserController = require('../controllers/user-controller')

const router = express.Router()


// User Routes
router.get('/loggedIn', UserController.getLoggedIn)
router.get('/login/', UserController.loginUser)
router.get('/logout/', UserController.logoutUser)
router.get('/users/userId/:id', UserController.getUserbyId)
router.get('/users/username/:username', UserController.getUserbyUsername)

router.post('/register', UserController.registerUser)
router.post('/changePassword', UserController.changePassword)




// Map Routes

// TileSet Routes

// Tile Routes

// Thread/Community? Routes


module.exports = router
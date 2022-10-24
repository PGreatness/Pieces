const express = require('express')
const UserController = require('../controllers/user-controller')

const router = express.Router()


// User Routes
router.get('/loggedIn', UserController.getLoggedIn)
router.get('/login/', UserController.loginUser)
router.get('/logout/', UserController.logoutUser)
router.get('/users/userId/:id', UserController.getUserbyId)
router.get('/users/username/:username', UserController.getUserbyUsername)
router.get('/forgotPassword', UserController.forgotPassword)

router.post('/updateUser', UserController.updateUser)
router.post('/register', UserController.registerUser)
router.post('/changePassword', UserController.changePassword)
router.post('/resetPassword', UserController.resetPassword)



// Map Routes
router.get('/map/:id', UserController.getMapbyId)

// TileSet Routes
router.get('/tileset/:id', UserController.getTilesetbyId)

// Tile Routes

// Thread/Community? Routes


module.exports = router
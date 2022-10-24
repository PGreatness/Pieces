const express = require('express')
const UserController = require('../controllers/user-controller')
const MapController = require('../controllers/map-controller')
const TilesetController = require('../controllers/tileset-controller')
const TileController = require('../controllers/tile-controller')
const ThreadController = require('../controllers/thread-controller')
const ChatController = require('../controllers/chat-controller')

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
router.get('/map/:ownerId', MapController.getAllUserMaps)
router.get('/map/:username', MapController.getUserMapsByName)
router.get('/map/:id', MapController.getMapbyId)

router.post('/map/newMap', MapController.createMap)
router.post('/map/deleteMap', MapController.deleteMap)
router.post('/map/updateMap', TilesetController.updateMap)



// TileSet Routes
router.get('/tileset/:ownerId', TilesetController.getAllUserTilesets)
router.get('/tileset/:username', TilesetController.getAllUserTilesetsByName)
router.get('/tileset/:id', TilesetController.getTilesetbyId)

router.post('/tileset/newTileset', TilesetController.createTileset)
router.post('/tileset/deleteTileset', TilesetController.deleteTileset)
router.post('/tileset/updateTileset', TilesetController.updateTileset)



// Tile Routes

// Thread Routes

// Chat Routes


module.exports = router
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
router.get('/map/getAllUserMaps/:ownerId', MapController.getAllUserMaps)
router.get('/map/getMapsByName/:mapName', MapController.getMapsByName)
router.get('/map/getMapById/:id', MapController.getMapbyId)
router.get('/map/getAllPublicMaps', MapController.getAllPublicMapsOnPage)

router.post('/map/newMap', MapController.createMap)
router.post('/map/deleteMap', MapController.deleteMap)
router.post('/map/updateMap', MapController.updateMap)
router.post('/map/publishMap', MapController.publishMap)
router.post('/map/addUserToMap', MapController.addUserToMap)



// // TileSet Routes
router.get('/tileset/userMaps/:ownerId', TilesetController.getAllUserTilesets)
router.get('/tileset/userMapsByName/:tilesetName', TilesetController.getUserTilesetsByName)
router.get('/tileset/userMapsById/:id', TilesetController.getTilesetbyId)

router.post('/tileset/newTileset', TilesetController.createTileset)
router.post('/tileset/deleteTileset', TilesetController.deleteTileset)
router.post('/tileset/updateTileset', TilesetController.updateTileset)
router.post('/tileset/publishTileset', TilesetController.publishTileset)


// Tile Routes
router.get('/tile/all', TileController.getAllTiles)
router.get('/tile/:id', TileController.getTileById)

router.post('/tile/newTile', TileController.createTile)
router.post('/tile/deleteTile', TileController.deleteTile)
router.post('/tile/updateTile', TileController.updateTile)

// Thread Routes
router.post('/thread/newThread', ThreadController.createThread)
router.post('/thread/deleteThread', ThreadController.deleteThread)

// Chat Routes
router.get('/chat/fetchChat', ChatController.fetchChat)
router.post('/chat/newChat', ChatController.createChat)
router.post('/chat/deleteChat', ChatController.deleteChat)
router.post('/chat/markChatAsSeen', ChatController.markChatAsSeen)

// Other Routes
router.get('/getAllPublicProjects', MapController.getAllPublicProjects)

module.exports = router
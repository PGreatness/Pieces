const express = require('express')
const UserController = require('../controllers/user-controller')
const MapController = require('../controllers/map-controller')
const TilesetController = require('../controllers/tileset-controller')
const TileController = require('../controllers/tile-controller')
const ThreadController = require('../controllers/thread-controller')
const ChatController = require('../controllers/chat-controller')
const NotificationController = require('../controllers/notification-controller')
const ProjectCommentController = require('../controllers/project-comment-controller')

const router = express.Router()


// User Routes
router.get('/loggedIn', UserController.getLoggedIn)
router.get('/login/', UserController.loginUser)
router.get('/logout/', UserController.logoutUser)
router.get('/users/getUserFavorites', UserController.getUserFavorites)
router.get('/users/userId/:id', UserController.getUserbyId)
router.get('/users/username/:username', UserController.getUserbyUsername)
router.get('/users/usernameAll/:username', UserController.getUsersbyUsername)
router.get('/users/all', UserController.getAllUsers)
router.get('/getFriends/userId/:id', UserController.getUserFriends)
router.get('/forgotPassword', UserController.forgotPassword)
router.get('/ownerAndCollabOf', UserController.getOwnerAndCollaboratorOfMaps)
router.get('/getLibraryMapsByName', UserController.getLibraryMapsByName)

router.post('/updateUser', UserController.updateUser)
router.post('/register', UserController.registerUser)
router.post('/changePassword', UserController.changePassword)
router.post('/resetPassword', UserController.resetPassword)
router.post('/addFriend', UserController.addFriend)
router.post('/removeFriend', UserController.removeFriend)
router.post('/uploadImage', UserController.uploadImage)
router.post('/deleteImage', UserController.deleteImage)

router.post('/deleteUser', UserController.deleteUser)

// Map Routes
router.get('/map/getAllUserMaps/:ownerId', MapController.getAllUserMaps)
router.get('/map/getAllUserAsCollaboratorMaps/:id', MapController.getAllUserAsCollaboratorMaps)
router.get('/map/getMapsByName/:title', MapController.getMapsByName)
router.get('/map/getMapById/:id', MapController.getMapbyId)
router.get('/map/getAllPublicMaps', MapController.getAllPublicMapsOnPage)
router.get('/map/getOwnerAndCollaborators', MapController.getOwnerAndCollaborator)

router.post('/map/newMap', MapController.createMap)
router.post('/map/deleteMap', MapController.deleteMap)
router.post('/map/updateMap', MapController.updateMap)
router.post('/map/publishMap', MapController.publishMap)
router.post('/map/addUserToMap', MapController.addUserToMap)
router.post('/map/removeUserFromMap', MapController.removeUserFromMap)
router.post('/map/importTilesetToMap', MapController.importTilesetToMap)

router.post('/comments/updateComment', ProjectCommentController.updateComment)
router.get('/comments/getAllProjectComments', ProjectCommentController.getAllProjectCommentsOnPage)
router.get('/comments/getCommentbyId/:id', ProjectCommentController.getCommentbyId)
router.post('/comments/updateComment/', ProjectCommentController.updateComment)
router.post('/comments/newComment/', ProjectCommentController.createComment)



// TileSet Routes
router.get('/tileset/getAllUserTilesets/:ownerId', TilesetController.getAllUserTilesets)
router.get('/tileset/getUserTilesetsByName/:title', TilesetController.getUserTilesetsByName)
router.get('/tileset/getTilesetsById/:id', TilesetController.getTilesetbyId)

router.post('/tileset/newTileset', TilesetController.createTileset)
router.post('/tileset/deleteTileset', TilesetController.deleteTileset)
router.post('/tileset/updateTileset', TilesetController.updateTileset)
router.post('/tileset/publishTileset', TilesetController.publishTileset)
router.post('/tileset/addUserToTileset', TilesetController.addUserToTileset)
router.post('/tileset/removeUserFromTileset', TilesetController.removeUserFromTileset)
router.post('/tileset/importTileset', TilesetController.importTileset)
router.post('/tileset/publishTileset', TilesetController.publishTileset)


// Tile Routes
router.get('/tile/all', TileController.getAllTiles)
router.get('/tile/:id', TileController.getTileById)
router.get('/tile/tilesetTiles/:id', TileController.getTilesetTiles)

router.post('/tile/newTile', TileController.createTile)
router.post('/tile/deleteTile', TileController.deleteTile)
router.post('/tile/updateTile', TileController.updateTile)


// Thread Routes
router.post('/thread/addReply/', ThreadController.addReply)
router.post('/thread/deleteReply/', ThreadController.removeReply)
router.get('/thread/getAllReplies/', ThreadController.getAllReplies)
router.get('/thread/getReplybyId/:id', ThreadController.getReplybyId)

router.get('/thread/all', ThreadController.getAllThreads)
router.post('/thread/newThread', ThreadController.createThread)
router.post('/thread/deleteThread', ThreadController.deleteThread)
router.post('/thread/like', ThreadController.likeThread)
router.post('/thread/dislike', ThreadController.dislikeThread)
router.post('/thread/allPosts', ThreadController.getPostsByUser)
router.get('/thread/:id', ThreadController.getThreadById)


// Notification Routes
router.post('/notification/requestMapEdit', NotificationController.requestMapEdit)
router.post('/notification/requestTilesetEdit', NotificationController.requestTilesetEdit)
router.post('/notification/friendRequest', NotificationController.friendRequest)
router.post('/notification/mapActionNotif', NotificationController.mapActionNotif)
router.post('/notification/mapDenyNotif', NotificationController.mapDenyNotif)
router.post('/notification/tilesetActionNotif', NotificationController.tilesetActionNotif)
router.post('/notification/tilesetDenyNotif', NotificationController.tilesetDenyNotif)
router.post('/notification/approveFriendRequest', NotificationController.approveFriendRequest)
router.post('/notification/denyFriendRequest', NotificationController.denyFriendRequest)
router.post('/notification/removeNotification', NotificationController.removeNotification)
router.post('/notification/removeAll', NotificationController.removeAllNotifications)
router.post('/notification/markAllSeen', NotificationController.markAllSeen)



// Chat Routes
router.get('/chat/fetchChat', ChatController.fetchChat)
router.post('/chat/newChat', ChatController.createChat)
router.post('/chat/deleteChat', ChatController.deleteChat)
router.post('/chat/markChatAsSeen', ChatController.markChatAsSeen)

// Other Project Routes
router.get('/getAllPublicProjects', MapController.getAllPublicProjects)
router.get('/getPublicProjectsByName/:name', MapController.getPublicProjectsByName)
router.get('/getUserProjects', MapController.getAllProjectsWithUser)
router.get('/changePage', MapController.getAllPublicProjects)
router.get('/getMapTilesets', MapController.getMapTilesets)

module.exports = router
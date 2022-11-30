import axios from 'axios'
// const axios = require('axios');

axios.defaults.withCredentials = true;
const api = axios.create({

    baseURL: 'http://localhost:4000/api',
    // baseURL: 'https://pieces-316.herokuapp.com/api',
})


// User
export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.get(`/login/`, {params: payload})
export const logoutUser = () => api.get(`/logout/`)
export const getUserById = (id) => api.get(`/users/userId/${id}/`)
export const getUserByUsername = (username) => api.get(`/users/username/${username}/`)
export const getUsersByUsername = (username) => api.get(`/users/usernameAll/${username}/`)
export const getAllUsers = () => api.get(`/users/all/`)
export const changePassword = (payload) => api.post(`/changePassword/`, payload)
export const forgotPassword = (payload) => api.get(`/forgotPassword/`, {params: payload})
export const resetPassword = (payload) => api.post(`/resetPassword/`, payload)
export const updateUser = (payload) => api.post(`/updateUser/`, payload)
export const addFriend = (payload) => api.post(`/addFriend/`, payload)
export const uploadImage = (payload) => api.post(`/uploadImage/`, payload)
export const deleteImage = (payload) => api.post(`/deleteImage/`, payload)
export const deleteUser = (payload) => api.post(`/deleteUser/`, payload)


// Projects
export const getAllPublicProjects = (query) => api.get(`/getAllPublicProjects/`, {params: query})
export const getPublicProjectsByName = (name) => api.get(`/getPublicProjectsByName/${name}/`)

// Map
export const getMapById = (id) => api.get(`/map/getMapById/${id}/`)
export const updateMap = (query, payload) => api.post(`/map/updateMap/`, payload, {params: query})
export const getAllUserMaps = (userId) => api.get(`/map/getAllUserMaps/${userId}/`)
export const getAllUserAsCollaboratorMaps = (id) => api.get(`/map/getAllUserAsCollaboratorMaps/${id}/`)
export const getUserAndCollabMaps = (id) => api.get(`/ownerAndCollabOf/`, {params: id})
export const getLibraryMapsByName = (payload) => api.get(`/getLibraryMapsByName/`, {params: payload})
export const createNewMap = (payload) => api.post(`/map/newMap/`, payload)
export const publishMap = (query, payload) => api.post(`/map/publishMap/`, payload, {params: query})
export const addMapCollaborator = (payload) => api.post(`/map/addUserToMap/`, payload)
export const removeMapCollaborator = (payload) => api.post(`/map/removeUserFromMap/`, payload)

// Tileset
export const getTilesetById = (id) => api.get(`/tileset/getTilesetsById/${id}/`)
export const updateTileset = (query, payload) => api.post(`/tileset/updateTileset`, payload, {params: query})
export const createNewTileset = (payload) => api.post(`/tileset/newTileset`, payload)
export const addTilesetCollaborator = (payload) => api.post(`/tileset/addUserToTileset/`, payload)
export const removeTilesetCollaborator = (payload) => api.post(`/tileset/removeUserFromTileset/`, payload)

// Tile
export const createTile = (payload) => api.post(`/tile/newTile`, payload)
export const getTileById = (id) => api.get(`/tile/${id}`)
export const updateTile = (payload) => api.post(`/tile/updateTile`, payload)

// Comments
export const getAllProjectComments = () => api.get(`/comments/getAllProjectComments/`)
export const getCommentbyId = (id) => api.get(`/comments/getCommentbyId/${id}`)
export const updateComment = (query, payload) => api.post(`/comments/updateComment/`, payload, {params: query})
export const createNewComment = (payload) => api.post(`/comments/newComment/`, payload)

// Pagination
export const changePage = (page, limit) => api.get(`/changePage`, page, {params: limit})

// Notifications
export const requestMapEdit = (payload) => api.post(`/notification/requestMapEdit/`, payload)
export const requestTilesetEdit = (payload) => api.post(`/notification/requestTilesetEdit/`, payload)
export const friendRequest = (payload) => api.post(`/notification/friendRequest/`, payload)
export const mapActionNotif = (payload) => api.post(`/notification/mapActionNotif/`, payload)
export const mapDenyNotif = (payload) => api.post(`/notification/mapDenyNotif/`, payload)
export const tilesetActionNotif = (payload) => api.post(`/notification/tilesetActionNotif/`, payload)
export const tilesetDenyNotif = (payload) => api.post(`/notification/tilesetDenyNotif/`, payload)
export const approveFriendRequest = (payload) => api.post(`/notification/approveFriendRequest/`, payload)
export const denyFriendRequest = (payload) => api.post(`/notification/denyFriendRequest/`, payload)
export const removeNotification = (payload) => api.post(`/notification/removeNotification/`, payload)
export const removeAllNotifications = (payload) => api.post(`/notification/removeAll/`, payload)
export const markAllSeen = (payload) => api.post(`/notification/markAllSeen/`, payload)

// COMMUNITY
// Threads
export const getAllThreads = (query) => api.get(`/thread/all`, {params: query})
export const getAllReplies = () => api.get(`/thread/getAllReplies/`)
export const addReply = (payload) => api.post(`/thread/addReply/`, payload)
export const removeReply = (payload) => api.post(`/thread/deleteReply/`, payload)
export const getReplybyId = (id) => api.get(`/thread/getReplybyId/${id}`)

export const getPopularThreads = (query) => api.get(`/thread/all`, {params: query})
export const registerLike = (payload) => api.post(`/thread/like`, payload)
export const registerDislike = (payload) => api.post(`/thread/dislike`, payload)
export const createThread = (payload) => api.post(`/thread/newThread`, payload)
export const deleteThread = (payload) => api.post(`/thread/deleteThread`,payload)
export const getPostsByUser = (payload) => api.post(`/thread/allPosts`, payload)
export const getThreadById = (payload) => api.get(`/thread/${payload}`)



const apis = {
    getAllPublicProjects,
    getAllProjectComments,
    getCommentbyId,
    updateComment,
    createNewComment,
    getPublicProjectsByName,
    getLibraryMapsByName,

    getAllUserMaps,
    getUserAndCollabMaps,
    getMapById,
    updateMap,
    getTilesetById,
    updateTileset,
    createNewTileset,
    createNewMap,
    publishMap,
    addMapCollaborator,
    removeMapCollaborator,

    createTile,
    getTileById,
    updateTile,

    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getUserById,
    getAllUsers,
    getUserByUsername,
    changePassword,
    updateUser,
    forgotPassword,
    resetPassword,
    uploadImage,
    deleteImage,
    deleteUser,
    changePage,
    requestMapEdit,
    requestTilesetEdit,
    friendRequest,
    addTilesetCollaborator,
    removeTilesetCollaborator,
    removeNotification,
    mapActionNotif,
    mapDenyNotif,
    tilesetActionNotif,
    tilesetDenyNotif,
    removeAllNotifications,
    markAllSeen,
    approveFriendRequest,
    denyFriendRequest,

    getAllThreads,
    addReply,
    removeReply,
    getThreadById,
    getPopularThreads,
    getPostsByUser,
    registerLike,
    registerDislike,
    getAllReplies,
    getReplybyId,
    createThread,
    deleteThread,

    addFriend,
}

export default apis

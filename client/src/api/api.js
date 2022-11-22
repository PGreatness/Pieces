import axios from 'axios'
// const axios = require('axios');

axios.defaults.withCredentials = true;
const api = axios.create({

    // baseURL: 'http://localhost:4000/api',
    baseURL: 'https://pieces-316.herokuapp.com/api',
})

// Comments
export const getAllProjectComments = () => api.get(`/comments/getAllProjectComments/`)
export const getCommentbyId = (id) => api.get(`/comments/getCommentbyId/${id}`)
export const updateComment = (query, payload) => api.post(`/comments/updateComment/`, payload, {params: query})
export const createNewComment = (payload) => api.post(`/comments/newComment/`, payload)

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

// Tile
export const createTile = (payload) => api.post(`/tile/newTile`, payload)
export const getTileById = (id) => api.get(`/tile/${id}`)
export const updateTile = (payload) => api.post(`/tile/updateTile`, payload)

// Tileset
export const getTilesetById = (id) => api.get(`/tileset/getTilesetsById/${id}/`)
export const updateTileset = (query, payload) => api.post(`/tileset/updateTileset`, payload, {params: query})
export const createNewTileset = (payload) => api.post(`/tileset/newTileset`, payload)

export const addTilesetCollaborator = (payload) => api.post(`/map/addUserToTileset/`, payload)
export const removeTilesetCollaborator = (payload) => api.post(`/map/removeUserFromTileset/`, payload)

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
export const uploadImage = (payload) => api.post(`/uploadImage/`, payload)
export const deleteImage = (payload) => api.post(`/deleteImage/`, payload)



// Pagination
export const changePage = (page, limit) => api.get(`/changePage`, page, {params: limit})

// Notification
export const requestMapEdit = (payload) => api.post(`/notification/requestMapEdit`, payload)
export const requestTilesetEdit = (payload) => api.post(`/notification/requestTilesetEdit`, payload)


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

    changePage,
    requestMapEdit,
    requestTilesetEdit,
    addTilesetCollaborator,
    removeTilesetCollaborator
}

export default apis
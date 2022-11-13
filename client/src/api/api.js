import axios from 'axios'
// const axios = require('axios');

axios.defaults.withCredentials = true;
const api = axios.create({

    baseURL: 'http://localhost:4000/api',
    // baseURL: 'https://pieces-316.herokuapp.com/api',
})

// Comments
export const getAllProjectComments = () => api.get(`/comments/getAllProjectComments/`)
export const getCommentbyId = (id) => api.get(`/comments/getCommentbyId/${id}`)
export const updateComment = (query, payload) => api.post(`/comments/updateComment/`, payload, {params: query})

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

// Tileset
export const getTilesetById = (id) => api.get(`/tileset/getTilesetsById/${id}/`)
export const updateTileset = (query, payload) => api.post(`/tileset/updateTileset`, payload, {params: query})
export const createNewTileset = (payload) => api.post(`/tileset/newTileset`, payload)

// User
export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.get(`/login/`, {params: payload})
export const logoutUser = () => api.get(`/logout/`)
export const getUserById = (id) => api.get(`/users/userId/${id}/`)

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

    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getUserById,

    changePage,
    requestMapEdit,
    requestTilesetEdit
}

export default apis
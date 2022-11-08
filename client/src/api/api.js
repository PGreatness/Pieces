import axios from 'axios'
// const axios = require('axios');

axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
    // baseURL: 'https://pieces-316.herokuapp.com/api',
})


// Api.get getAllPublicProjects instead of getAllPublicMaps
export const getAllPublicProjects = () => api.get(`/map/getAllPublicMaps/`)
export const getMapById = (id) => api.get(`/map/getMapById/${id}/`)
export const updateMap = (query, payload) => api.post(`/map/updateMap/`, payload, {params: query})



export const getAllUserMaps = (userId) => api.get(`/map/getAllUserMaps/${userId}/`)
export const getAllUserAsCollaboratorMaps = (id) => api.get(`/map/getAllUserAsCollaboratorMaps/${id}/`)
export const getUserAndCollabMaps = (id) => api.get(`/ownerAndCollabOf/`, {params: id})


export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.get(`/login/`, {params: payload})
export const logoutUser = () => api.get(`/logout/`)

export const getUserById = (id) => api.get(`/users/userId/${id}/`)

const apis = {
    getAllPublicProjects,
    getAllUserMaps,
    getUserAndCollabMaps,
    getMapById,
    updateMap,

    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getUserById
}

export default apis
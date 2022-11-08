import axios from 'axios'
// const axios = require('axios');

axios.defaults.withCredentials = true;
const api = axios.create({
    //baseURL: 'http://localhost:4000/api',
    baseURL: 'https://pieces-316.herokuapp.com/api',
})


// Api.get getAllPublicProjects instead of getAllPublicMaps
export const getAllPublicProjects = () => api.get(`/map/getAllPublicMaps/`)

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.get(`/login/`, {params: payload})
export const logoutUser = () => api.get(`/logout/`)

export const getUserById = (id) => api.get(`/users/userId/${id}/`)

export const changePage = (page, limit) => api.get(`/changePage`, page, {params: limit})

const apis = {
    getAllPublicProjects,

    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getUserById,

    changePage,
}

export default apis
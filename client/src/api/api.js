import axios from 'axios'
// const axios = require('axios');

axios.defaults.withCredentials = true;
const api = axios.create({
<<<<<<< HEAD
    baseURL: 'http://localhost:4000/api',
    // baseURL: 'https://pieces-316.herokuapp.com/api',
=======
    //baseURL: 'http://localhost:4000/api',
    baseURL: 'https://pieces-316.herokuapp.com/api',
>>>>>>> b1e94ef62a72c967bdf55c665101b78cf2329919
})


// Api.get getAllPublicProjects instead of getAllPublicMaps
export const getAllPublicProjects = () => api.get(`/map/getAllPublicMaps/`)
export const getAllProjectComments = () => api.get(`/map/getAllProjectComments/`)

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.get(`/login/`, {params: payload})
export const logoutUser = () => api.get(`/logout/`)

export const getUserById = (id) => api.get(`/users/userId/${id}/`)

const apis = {
    getAllPublicProjects,
<<<<<<< HEAD
    getAllProjectComments,
=======
>>>>>>> b1e94ef62a72c967bdf55c665101b78cf2329919

    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getUserById
}

export default apis
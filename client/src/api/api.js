import axios from 'axios'

axios.defaults.withCredentials = true;
const api = axios.create({
    //baseURL: 'http://localhost:4000/api',
    baseURL: 'http://pieces-316.herokuapp.com/api',
})


// Api.get getAllPublicProjects instead of getAllPublicMaps
export const getAllPublicProjects = () => api.get(`/map/getAllPublicMaps/`)

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.get(`/login/`, {params: payload})
export const logoutUser = () => api.get(`/logout/`)

const apis = {
    getAllPublicProjects,

    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis
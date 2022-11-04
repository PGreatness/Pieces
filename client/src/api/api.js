import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const registerUser = (payload) => api.post(`/register/`, payload)
export const loginUser = (payload) => api.get(`/login/`, {params: payload})
export const logoutUser = () => api.get(`/logout/`)

const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis
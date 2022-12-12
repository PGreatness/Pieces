import io from 'socket.io-client';
import React, { createContext, useEffect, useState } from "react";
import api from '../api/api'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    SET_ERROR_MESSAGE: "SET_ERROR_MESSAGE",
    CHANGE_USER: "CHNAGE_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null,
        socket: null
    });
    const navigate = useNavigate();

    const loginUser = async () => {
        if (!auth.user) {
            auth.getLoggedIn(auth, (user) => {
                console.log("logged in user: " + user);
            })
        }
    }

    useEffect(() => {
        loginUser();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;

        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: null,
                    socket: payload.socket
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    socket: payload.socket,
                    errorMessage: null
                })
            }
            case AuthActionType.SET_ERROR_MESSAGE: {
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    errorMessage: payload.message,
                    socket: auth.socket
                });
            }
            case AuthActionType.CHANGE_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: auth.loggedIn,
                    errorMessage: payload.message,
                    socket: auth.socket
                });
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function (store, callback) {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            //store.changePageToExplore(); 
            console.log("user is logged in")
            const socket = io('https://pieces-316.herokuapp.com');
            //const socket = io('localhost:4000');
            socket.emit('login', response.data.user._id);

            if (response.data.user._id === auth.user?._id) {
                callback(response.data.user);
                return;
            }

            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user,
                    socket: socket
                }
            });
            callback(response.data.user);
        }
    }


    auth.loginUser = async function (userData, store, callback) {

        await api.loginUser(userData).then(response => {
            console.log(response.data)
            const socket = io('https://pieces-316.herokuapp.com');
            //const socket = io('localhost:4000');
            socket.emit('login', response.data.user._id);
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    socket: socket
                }
            });
            //store.changePageToExplore();
            //navigate("/explore");
            callback(response.data.user);
        })
            .catch(({ response }) => {
                console.log('error error')
                if (response) {
                    authReducer({
                        type: AuthActionType.SET_ERROR_MESSAGE,
                        payload: {
                            message: response.data.message
                        }
                    })
                }
            });

    }

    auth.registerUser = async function (userData) {
        await api.registerUser(userData).then(response => {
            navigate("/");
        })
            .catch(({ response }) => {
                if (response) {
                    authReducer({
                        type: AuthActionType.SET_ERROR_MESSAGE,
                        payload: {
                            message: response.data.message
                        }
                    })
                }
            });
    }

    auth.changePassword = async function (userData, callback) {
        await api.changePassword(userData).then(response => {
            console.log(response.data)
            authReducer({
                type: AuthActionType.CHANGE_USER,
                payload: {
                    user: response.data.user,
                    message: response.data.message,
                    socket: auth.socket
                }
            });
            callback(response.data.user);
        })
            .catch(({ response }) => {
                if (response) {
                    authReducer({
                        type: AuthActionType.SET_ERROR_MESSAGE,
                        payload: {
                            message: response.data.message
                        }
                    })
                }
            });
    }


    auth.updateUser = async function (userData, callback) {
        await api.updateUser(userData).then(response => {
            console.log(response.data)
            authReducer({
                type: AuthActionType.CHANGE_USER,
                payload: {
                    user: response.data.user,
                    message: response.data.message,
                    socket: auth.socket
                }
            });
            console.log(response.data.user)
            callback(response.data.user);
        })
            .catch(({ response }) => {
                if (response) {
                    authReducer({
                        type: AuthActionType.SET_ERROR_MESSAGE,
                        payload: {
                            message: response.data.message
                        }
                    })
                }
            });
    }


    auth.forgotPassword = async function (userData) {
        await api.forgotPassword(userData).then(response => {
            console.log(response)

            authReducer({
                type: AuthActionType.SET_ERROR_MESSAGE,
                payload: {
                    message: response.data.message
                }
            })

        });
    }


    auth.resetPassword = async function (userData) {
        await api.resetPassword(userData).then(response => {
            console.log(response.data)
            authReducer({
                type: AuthActionType.SET_ERROR_MESSAGE,
                payload: {
                    message: response.data.message
                }
            })
        
        });
    }


    auth.uploadImage = async function (imgData, callback) {
        await api.uploadImage(imgData).then(response => {
            console.log(response.data)
            authReducer({
                type: AuthActionType.CHANGE_USER,
                payload: {
                    user: response.data.user,
                    message: response.data.message,
                    socket: auth.socket
                }
            });
            callback(response.data.user);
        })
            .catch(({ response }) => {
                if (response) {
                    authReducer({
                        type: AuthActionType.SET_ERROR_MESSAGE,
                        payload: {
                            message: response.data.message
                        }
                    })
                }
            });
    }

    auth.deleteUser = async function () {
        let payload = {
            id: auth.user._id
        }
        await api.deleteUser(payload).then(response => {
            console.log(response.data)
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    socket: null
                }
            });
        })
            .catch(({ response }) => {
                if (response) {
                    authReducer({
                        type: AuthActionType.SET_ERROR_MESSAGE,
                        payload: {
                            message: response.data.message
                        }
                    })
                }
            });
    }

    auth.deleteImage = async function (imgData, callback) {
        await api.deleteImage(imgData).then(response => {
            console.log(response.data)
            authReducer({
                type: AuthActionType.CHANGE_USER,
                payload: {
                    user: response.data.user,
                    message: response.data.message
                }
            });
            callback(response.data.user);
        })
            .catch(({ response }) => {
                if (response) {
                    authReducer({
                        type: AuthActionType.SET_ERROR_MESSAGE,
                        payload: {
                            message: response.data.message
                        }
                    })
                }
            });
    }

    auth.getUserById = async function (id, setOwnerCallback) {
        console.log('wtf')
        const response = await api.getUserById(id);
        //console.log(response)
        if (response.status === 200) {
            //console.log(response.data)
            setOwnerCallback(response.data.user)
            //return response.data.user;
        }
    }

    auth.getUsersByUsername = async function (username) {
        const response = await api.getUsersByUsername(username);
        if (response.status === 200) {
            return response;
        }
    }

    auth.getAllUsers = async function () {
        const response = await api.getAllUsers();
        if (response.status === 200) {
            return response.data.users;
        }
    }


    auth.getUserByUsername = async function (username, setOwnerCallback) {
        const response = await api.getUserByUsername(username);
        //console.log(response)
        if (response.status === 200) {
            //console.log(response.data)
            setOwnerCallback(response.data.user)
            //return response.data.user;
        }
    }

    auth.getOwnerAndCollaborators = async function (id, isMap) {
        const response = await api.getOwnerAndCollaborators({id:id, isMap: isMap});
        console.log(response)
        if (response.status < 400) {
            return response.data;
        }
    }

    auth.removeNotification = async function (id, userId, callback) {
        let payload = {
            id: id, 
            userId: userId
        }

        const response = await api.removeNotification(payload);
        if (response.data.success) {
            console.log(response)
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    socket: auth.socket
                }
            });
            callback(response.data.user)
        }
        else {
            console.log("API FAILED TO DELETE NOTIFICATION")
        }
    }


    auth.removeAllNotifications = async function (userId, callback) {
        let payload = {
            userId: userId
        }

        const response = await api.removeAllNotifications(payload);
        if (response.data.success) {
            console.log(response)
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    socket: auth.socket
                }
            });
            callback(response.data.user)
        }
        else {
            console.log("API FAILED TO DELETE NOTIFICATION")
        }
    }

    auth.markAllSeen = async function (userId, callback) {
        let payload = {
            userId: userId
        }

        const response = await api.markAllSeen(payload);
        if (response.data.success) {
            console.log(response)
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    socket: auth.socket
                }
            });
            callback(response.data.user)
        }
        else {
            console.log("API FAILED TO DELETE NOTIFICATION")
        }
    }

    auth.mapActionNotification = async function (ownerId, newUserId, mapId, callback) {
        let payload = {
            ownerId: ownerId, 
            newUserId: newUserId, 
            mapId: mapId
        }

        const response = await api.mapActionNotif(payload);
        if (response.data.success) {
            console.log(response)
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    socket: auth.socket
                }
            });
            callback(response.data.user)
        }
        else {
            console.log("API FAILED TO ADD NOTIFICATION")
        }
    }

    auth.mapDenyNotification = async function (ownerId, newUserId, mapId, callback) {
        let payload = {
            ownerId: ownerId, 
            newUserId: newUserId, 
            mapId: mapId
        }

        const response = await api.mapDenyNotif(payload);
        if (response.data.success) {
            console.log(response)
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    socket: auth.socket
                }
            });
            callback(response.data.user)
        }
        else {
            console.log("API FAILED TO ADD NOTIFICATION")
        }
    }

    auth.tilesetActionNotification = async function (ownerId, newUserId, tilesetId, callback) {
        let payload = {
            ownerId: ownerId, 
            newUserId: newUserId, 
            tilesetId: tilesetId
        }

        const response = await api.tilesetActionNotif(payload);
        if (response.data.success) {
            console.log(response)
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    socket: auth.socket
                }
            });
            callback(response.data.user)
        }
        else {
            console.log("API FAILED TO ADD NOTIFICATION")
        }
    }

    auth.tilesetDenyNotification = async function (ownerId, newUserId, tilesetId, callback) {
        let payload = {
            ownerId: ownerId, 
            newUserId: newUserId, 
            tilesetId: tilesetId
        }

        const response = await api.tilesetDenyNotif(payload);
        if (response.data.success) {
            console.log(response)
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    socket: auth.socket
                }
            });
            callback(response.data.user)
        }
        else {
            console.log("API FAILED TO ADD NOTIFICATION")
        }
    }

    auth.sendFriendRequest = async function (senderId, receiverId) {
        let payload = {
            senderId: senderId, 
            receiverId: receiverId
        }

        await api.friendRequest(payload).then(response => {
            console.log(response.data)
            console.log("API SENT FRIEND REQUEST NOTIFICATION")
        })
            .catch(({ response }) => {
                if (response) {
                    authReducer({
                        type: AuthActionType.SET_ERROR_MESSAGE,
                        payload: {
                            message: response.data.message
                        }
                    })
                }
            });
    }

    auth.addFriend = async function (userId, friendId, callback) {
        let payload = {
            userId: userId,
            friendId: friendId
        }

        const response = await api.addFriend(payload);
        if (response.data.success) {
            console.log(response)
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    socket: auth.socket
                }
            });
            callback(response.data.user)
        }
        else {
            console.log("API ADDED FRIEND")
        }
    }

    auth.removeFriend = async function (userId, friendId) {
        let payload = {
            userId: userId,
            friendId: friendId
        }

        const response = await api.removeFriend(payload);
        if (response.data.success) {
            console.log(response)
        }
        else {
            console.log("API ADDED FRIEND")
        }
    }


    auth.approveFriendRequest = async function (senderId, receiverId, callback) {
        let payload = {
            senderId: senderId,
            receiverId: receiverId
        }

        const response = await api.approveFriendRequest(payload);
        if (response.data.success) {
            console.log(response)
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    socket: auth.socket
                }
            });
            callback(response.data.user)
        }
        else {
            console.log("API ADDED APPROVED FRIEND REQUEST NOTIFICATION")
        }
    }

    auth.denyFriendRequest = async function (senderId, receiverId, callback) {
        let payload = {
            senderId: senderId,
            receiverId: receiverId
        }

        const response = await api.denyFriendRequest(payload);
        if (response.data.success) {
            console.log(response)
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user,
                    socket: auth.socket
                }
            });
            callback(response.data.user)
        }
        else {
            console.log("API ADDED DENIED FRIEND REQUEST NOTIFICATION")
        }
    }

    auth.logoutUser = async function (store, callback) {
        const response = await api.logoutUser();
        if (response.status === 200) {
            auth.socket.emit("logout", auth.user._id);
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false,
                    socket: null
                }
            });
            store.reset();
            callback();
            //navigate("/");
        }
    }

    auth.resetMessage = function () {
        authReducer({
            type: AuthActionType.SET_ERROR_MESSAGE,
            payload: {
                message: null
            }
        });
    }


    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };


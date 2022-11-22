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
        errorMessage: null
    });
    const navigate = useNavigate();

    const authReducer = (action) => {
        const { type, payload } = action;

        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: null
                })
            }
            case AuthActionType.SET_ERROR_MESSAGE: {
                return setAuth({
                    user: auth.user,
                    loggedIn: auth.loggedIn,
                    errorMessage: payload.message
                });
            }
            case AuthActionType.CHANGE_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: auth.loggedIn,
                    errorMessage: payload.message
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

            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
            callback(response.data.user);
        }
    }


    auth.loginUser = async function (userData, store, callback) {

        await api.loginUser(userData).then(response => {
            console.log(response.data)
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
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


    auth.updateUser = async function (userData, callback) {
        await api.updateUser(userData).then(response => {
            console.log(response.data)
            authReducer({
                type: AuthActionType.CHANGE_USER,
                payload: {
                    user: response.data.user,
                    message: response.data.message
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


    auth.logoutUser = async function (store, callback) {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    user: null,
                    loggedIn: false
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


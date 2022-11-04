import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    SET_ERROR_MESSAGE: "SET_ERROR_MESSAGE"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null
    });
    
    const history = useHistory();

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
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function (store) {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            //store.changePageToHome(response.data.user); 

            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }


    auth.loginUser = async function(userData, store){
        await api.loginUser(userData).then(response => {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            });
            //store.changePageToHome();
            //history.push("/list");
        })
        .catch(({response}) => {
            if(response){ 
                authReducer({
                    type: AuthActionType.SET_ERROR_MESSAGE,
                    payload:{
                        message: response.data.errorMessage
                    }
                })
            }
        });      
        
    }

    auth.logoutUser = async function(store){
        const response = await api.logoutUser();
        if(response.status === 200){
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload:{
                    user: null,
                    loggedIn: false
                }
            });
            //store.reset(); 
            //history.push("/");
        }
    }

    auth.resetMessage = function () {
        authReducer({
            type: AuthActionType.SET_ERROR_MESSAGE,
            payload:{
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


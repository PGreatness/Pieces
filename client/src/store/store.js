import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/api'
import AuthContext from '../auth/auth'

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    LOAD_PUBLIC_PROJECTS: "LOAD_PUBLIC_PROJECTS",
    SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
    GET_MAP_OWNER: "GET_MAP_OWNER",
    LOAD_PROJECT_COMMENTS: "LOAD_PROJECT_COMMENTS"
}


function GlobalStoreContextProvider(props) {
    const navigate = useNavigate();


    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        publicProjects: [],
        projectComments: [],
        currentPage: "explore",
        mapOwner: null
    });



    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);




    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {

            // GET ALL PUBLIC PROJECTS SO WE CAN PRESENT THEM IN EXPLORE SCREEN
            case GlobalStoreActionType.LOAD_PUBLIC_PROJECTS: {
                return setStore({
                    publicProjects: payload,
                    currentPage: store.currentPage,
                    mapOwner: store.mapOwner,
                    projectComments: store.projectComments
                });
            }

            case GlobalStoreActionType.SET_CURRENT_PAGE: {
                return setStore({
                    publicProjects: payload.publicProjects,
                    currentPage: payload.currentPage,
                    mapOwner: store.mapOwner,
                    projectComments: store.projectComments
                });
            }

            case GlobalStoreActionType.GET_MAP_OWNER: {
                return setStore({
                    publicProjects: store.publicProjects,
                    currentPage: store.currentPage,
                    mapOwner: payload,
                    projectComments: store.projectComments
                });
            }

            case GlobalStoreActionType.LOAD_PROJECT_COMMENTS: {
                return setStore({
                    publicProjects: store.publicProjects,
                    currentPage: store.currentPage,
                    mapOwner: store.mapOwner,
                    projectComments: payload
                });
            }

            default:
                return store;
        }
    }


    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.


    store.loadPublicProjects = async function () {

        // Ahnaf is writing the getAllPublicProjects in the backend
        const response = await api.getAllPublicProjects();
        if (response.data.success) {
            let publicProjects = response.data.maps;
            storeReducer({
                type: GlobalStoreActionType.LOAD_PUBLIC_PROJECTS,
                payload: publicProjects
            });
        } else {
            console.log("API FAILED TO GET THE PUBLIC PROJECTS");
        }

    }

    store.loadPublicProjectComments = async function () {
        const response = await api.getAllProjectComments();
        if (response.data.success) {
            let projectComments = response.data.comments;
            storeReducer({
                type: GlobalStoreActionType.LOAD_PROJECT_COMMENTS,
                payload: projectComments
            });
        } else {
            console.log("API FAILED TO GET THE PROJECT COMMENTS");
        }

    }


    store.changePageToExplore = async function () {
        console.log("in store")
        const response = await api.getAllPublicProjects();
        if(response.data.success){
            console.log(response.data)
            let publicProjects = response.data.maps;
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_PAGE,
                payload: {
                    currentPage: "explore",
                    publicProjects: publicProjects
                }
            });
        } else {
            console.log("API FAILED TO GET THE PUBLIC PROJECTS");
        }
    }


    store.getUserById = async function (id) {
        const response = await api.getUserById(id);
        if(response.status === 200){
            storeReducer({
                type: GlobalStoreActionType.GET_MAP_OWNER,
                payload: response.data.user
            });
        }
    } 


    store.updateCommentLikes = async function (id, setLikeDislikeCallback) {
        await api.getCommentbyId(id).then( response => {
            console.log(response)
            let comment = response.data.comment;
            if(comment.likes.includes(auth.user._id)){
                let index = comment.likes.indexOf(auth.user._id);
                comment.likes.splice(index, 1); 
            } else if (comment.dislikes.includes(auth.user._id)){
                let index = comment.dislikes.indexOf(auth.user._id);
                comment.dislikes.splice(index, 1); 
                comment.likes.push(auth.user._id); 
            } else {
                comment.likes.push(auth.user._id); 
            }


            async function updatingComment(comment){
                let payload = {
                    likes: comment.likes,
                    dislikes: comment.dislikes
                };

                let query = {
                    id: comment._id,
                    ownerId: auth.user._id
                }
                console.log(comment._id)
                response = await api.updateComment(query, payload); 
                
                if(response.data.success){
                    setLikeDislikeCallback(comment.likes, comment.dislikes);
                    store.loadPublicProjectComments(); 
                }
            }

            updatingComment(comment)
        });
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };


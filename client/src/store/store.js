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
<<<<<<< HEAD
                    mapOwner: store.mapOwner,
                    projectComments: store.projectComments
=======
                    mapOwner: store.mapOwner
>>>>>>> b1e94ef62a72c967bdf55c665101b78cf2329919
                });
            }

            case GlobalStoreActionType.SET_CURRENT_PAGE: {
                return setStore({
                    publicProjects: payload.publicProjects,
                    currentPage: payload.currentPage,
<<<<<<< HEAD
                    mapOwner: store.mapOwner,
                    projectComments: store.projectComments
=======
                    mapOwner: store.mapOwner
>>>>>>> b1e94ef62a72c967bdf55c665101b78cf2329919
                });
            }

            case GlobalStoreActionType.GET_MAP_OWNER: {
                return setStore({
                    publicProjects: store.publicProjects,
                    currentPage: store.currentPage,
<<<<<<< HEAD
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
=======
                    mapOwner: payload
>>>>>>> b1e94ef62a72c967bdf55c665101b78cf2329919
                });
            }

            default:
                return store;
        }
    }


<<<<<<< HEAD
=======




>>>>>>> b1e94ef62a72c967bdf55c665101b78cf2329919
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


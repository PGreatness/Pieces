import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/api'
import AuthContext from '../auth/auth'

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    LOAD_PUBLIC_PROJECTS: "LOAD_PUBLIC_PROJECTS",
    SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
    GET_MAP_OWNER: "GET_MAP_OWNER"
}


function GlobalStoreContextProvider(props) {
    const navigate = useNavigate();


    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        publicProjects: [],
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
                    mapOwner: store.mapOwner
                });
            }

            case GlobalStoreActionType.SET_CURRENT_PAGE: {
                return setStore({
                    publicProjects: payload.publicProjects,
                    currentPage: payload.currentPage,
                    mapOwner: store.mapOwner
                });
            }

            case GlobalStoreActionType.GET_MAP_OWNER: {
                return setStore({
                    publicProjects: store.publicProjects,
                    currentPage: store.currentPage,
                    mapOwner: payload
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


    store.updateLikes = async function (id, setLikeDislikeCallback) {
        await api.getMapById(id).then( response => {
            console.log(response.data.map)
            let map = response.data.map;
            if(map.likes.includes(auth.user._id)){
                let index = map.likes.indexOf(auth.user._id);
                map.likes.splice(index, 1); 
            } else if (map.dislikes.includes(auth.user._id)){
                let index = map.dislikes.indexOf(auth.user._id);
                map.dislikes.splice(index, 1); 
                map.likes.push(auth.user._id); 
            } else {
                map.likes.push(auth.user._id); 
            }


            async function updatingMap(map){
                let payload = {
                    likes: map.likes,
                    dislikes: map.dislikes
                };

                let query = {
                    id: map._id,
                    ownerId: auth.user._id
                }
                response = await api.updateMap(query, payload); 
                if(response.data.success){
                    setLikeDislikeCallback(map.likes, map.dislikes);
                    store.loadPublicProjects(); 
                }
            }

            updatingMap(map)
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


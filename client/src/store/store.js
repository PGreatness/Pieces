import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/api'
import AuthContext from '../auth/auth'

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    LOAD_PUBLIC_PROJECTS: "LOAD_PUBLIC_PROJECTS",
    SET_CURRENT_PAGE: "SET_CURRENT_PAGE"
}


function GlobalStoreContextProvider(props) {
    const navigate = useNavigate();


    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        publicProjects: [],
        currentPage: "explore"
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
                    currentPage: store.currentPage
                });
            }

            case GlobalStoreActionType.SET_CURRENT_PAGE: {
                return setStore({
                    publicProjects: payload.publicProjects,
                    currentPage: payload.currentPage
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
            let publicProjects = response.data.projects;
            storeReducer({
                type: GlobalStoreActionType.LOAD_PUBLIC_PROJECTS,
                payload: publicProjects
            });
        } else {
            console.log("API FAILED TO GET THE PUBLIC PROJECTS");
        }

    }


    store.changePageToExplore = async function () {
        const response = await api.getAllPublicProjects();
        if(response.data.success){
            console.log(response.data)
            let publicProjects = response.data.projects;
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



    store.updateMapLikes = async function (id, setLikeDislikeCallback) {
        await api.getMapById(id).then( response => {
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
                console.log(map._id)
                response = await api.updateMap(query, payload); 
                
                if(response.data.success){
                    setLikeDislikeCallback(map.likes, map.dislikes);
                    store.loadPublicProjects(); 
                }
            }

            updatingMap(map)
        });
    }



    store.updateMapDislikes = async function (id, setLikeDislikeCallback) {
        await api.getMapById(id).then( response => {
            let map = response.data.map;
            if(map.dislikes.includes(auth.user._id)){
                let index = map.dislikes.indexOf(auth.user._id);
                map.dislikes.splice(index, 1); 
            } else if (map.likes.includes(auth.user._id)){
                let index = map.likes.indexOf(auth.user._id);
                map.likes.splice(index, 1); 
                map.dislikes.push(auth.user._id); 
            } else {
                map.dislikes.push(auth.user._id); 
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


    store.updateMapFav = async function (id, setFavCallback) {
        await api.getMapById(id).then( response => {
            let map = response.data.map;
            if(map.favs.includes(auth.user._id)){
                let index = map.favs.indexOf(auth.user._id);
                map.favs.splice(index, 1); 
            } else {
                map.favs.push(auth.user._id); 
            }

            async function updatingMap(map){
                let payload = {
                    favs: map.favs
                };
                let query = {
                    id: map._id,
                    ownerId: auth.user._id
                }

                response = await api.updateMap(query, payload);
                
                if(response.data.success){
                    setFavCallback(map.favs);
                    store.loadPublicProjects();  
                }
            }
            updatingMap(map)
        });
    }




    store.updateTilesetLikes = async function (id, setLikeDislikeCallback) {
        await api.getTilesetById(id).then( response => {
            let tileset = response.data.tileset;
            if(tileset.likes.includes(auth.user._id)){
                let index = tileset.likes.indexOf(auth.user._id);
                tileset.likes.splice(index, 1); 
            } else if (tileset.dislikes.includes(auth.user._id)){
                let index = tileset.dislikes.indexOf(auth.user._id);
                tileset.dislikes.splice(index, 1); 
                tileset.likes.push(auth.user._id); 
            } else {
                tileset.likes.push(auth.user._id); 
            }


            async function updatingTileset(tileset){
                let payload = {
                    likes: tileset.likes,
                    dislikes: tileset.dislikes
                };

                let query = {
                    id: tileset._id,
                    ownerId: auth.user._id
                }
                console.log(tileset._id)
                response = await api.updateTileset(query, payload); 
                
                if(response.data.success){
                    setLikeDislikeCallback(tileset.likes, tileset.dislikes);
                    store.loadPublicProjects(); 
                }
            }

            updatingTileset(tileset)
        });
    }



    store.updateTilesetDislikes = async function (id, setLikeDislikeCallback) {
        await api.getTilesetById(id).then( response => {
            let tileset = response.data.tileset;
            if(tileset.dislikes.includes(auth.user._id)){
                let index = tileset.dislikes.indexOf(auth.user._id);
                tileset.dislikes.splice(index, 1); 
            } else if (tileset.likes.includes(auth.user._id)){
                let index = tileset.likes.indexOf(auth.user._id);
                tileset.likes.splice(index, 1); 
                tileset.dislikes.push(auth.user._id); 
            } else {
                tileset.dislikes.push(auth.user._id); 
            }
            async function updatingTileset(tileset){
                let payload = {
                    likes: tileset.likes,
                    dislikes: tileset.dislikes
                };
                let query = {
                    id: tileset._id,
                    ownerId: auth.user._id
                }

                response = await api.updateTileset(query, payload);
                
                if(response.data.success){
                    setLikeDislikeCallback(tileset.likes, tileset.dislikes);
                    store.loadPublicProjects();  
                }
            }
            updatingTileset(tileset)
        });
    }


    store.updateTilesetFav = async function (id, setFavCallback) {
        await api.getTilesetById(id).then( response => {
            let tileset = response.data.tileset;
            if(tileset.favs.includes(auth.user._id)){
                let index = tileset.favs.indexOf(auth.user._id);
                tileset.favs.splice(index, 1); 
            } else {
                tileset.favs.push(auth.user._id); 
            }

            async function updatingTileset(tileset){
                let payload = {
                    favs: tileset.favs
                };
                let query = {
                    id: tileset._id,
                    ownerId: auth.user._id
                }

                response = await api.updateTileset(query, payload);
                
                if(response.data.success){
                    setFavCallback(tileset.favs);
                    store.loadPublicProjects();  
                }
            }
            updatingTileset(tileset)
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


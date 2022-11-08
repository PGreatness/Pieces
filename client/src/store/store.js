import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/api'
import AuthContext from '../auth/auth'

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    LOAD_PUBLIC_PROJECTS: "LOAD_PUBLIC_PROJECTS",
    LOAD_ALL_USER_MAPS: "LOAD_ALL_USER_MAPS",
    LOAD_ALL_USER_AS_COLLABORATOR_MAPS: "LOAD_ALL_USER_AS_COLLABORATOR_MAPS",
    LOAD_USER_AND_COLLAB_MAPS: "LOAD_USER_AND_COLLAB_MAPS",
    SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
    GET_MAP_OWNER: "GET_MAP_OWNER",
    SET_LIBRARY_SORTED_LIST: "SET_LIBRARY_SORTED_LIST"
}


function GlobalStoreContextProvider(props) {
    const navigate = useNavigate();


    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        publicProjects: [],
        userMaps: [],
        collabMaps: [],
        userAndCollabMaps: [],
        librarySortOption: "",
        librarySortDirection: "",
        sortedLibraryList: [],
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
                    userMaps: store.userMaps,
                    collabMaps: store.collabMaps,
                    currentPage: store.currentPage,
                    mapOwner: store.mapOwner,
                    librarySortOption: store.librarySortOption,
                    librarySortDirection: store.librarySortDirection,
                    sortedLibraryList: store.sortedLibraryList
                });
            }

            case GlobalStoreActionType.LOAD_ALL_USER_MAPS: {
                return setStore({
                    publicProjects: store.publicProjects,
                    userMaps: payload,
                    collabMaps: store.collabMaps,
                    currentPage: store.currentPage,
                    mapOwner: store.mapOwner,
                    librarySortOption: store.librarySortOption,
                    librarySortDirection: store.librarySortDirection,
                    sortedLibraryList: store.sortedLibraryList
                })
            }

            case GlobalStoreActionType.LOAD_ALL_USER_AS_COLLABORATOR_MAPS: {
                return setStore({
                    publicProjects: store.publicProjects,
                    userMaps: store.userMaps,
                    collabMaps: payload,
                    currentPage: store.currentPage,
                    mapOwner: store.mapOwner,
                    librarySortOption: store.librarySortOption,
                    librarySortDirection: store.librarySortDirection,
                    sortedLibraryList: store.sortedLibraryList
                })
            }

            case GlobalStoreActionType.LOAD_USER_AND_COLLAB_MAPS: {
                return setStore({
                    publicProjects: store.publicProjects,
                    userMaps: payload.userMaps,
                    collabMaps: payload.collabMaps,
                    currentPage: store.currentPage,
                    mapOwner: store.mapOwner,
                    librarySortOption: store.librarySortOption,
                    librarySortDirection: store.librarySortDirection,
                    sortedLibraryList: store.sortedLibraryList
                })
            }

            case GlobalStoreActionType.SET_CURRENT_PAGE: {
                return setStore({
                    publicProjects: payload.publicProjects,
                    userMaps: store.userMaps,
                    collabMaps: store.collabMaps,
                    currentPage: payload.currentPage,
                    mapOwner: store.mapOwner,
                    librarySortOption: store.librarySortOption,
                    librarySortDirection: store.librarySortDirection,
                    sortedLibraryList: store.sortedLibraryList
                });
            }

            case GlobalStoreActionType.GET_MAP_OWNER: {
                return setStore({
                    publicProjects: store.publicProjects,
                    userMaps: store.userMaps,
                    collabMaps: store.collabMaps,
                    currentPage: store.currentPage,
                    mapOwner: payload,
                    librarySortOption: store.librarySortOption,
                    librarySortDirection: store.librarySortDirection,
                    sortedLibraryList: store.sortedLibraryList
                });
            }

            case GlobalStoreActionType.SET_LIBRARY_SORTED_LIST: {
                return setStore({
                    publicProjects: store.publicProjects,
                    userMaps: store.userMaps,
                    collabMaps: store.collabMaps,
                    currentPage: store.currentPage,
                    mapOwner: store.mapOwner,
                    librarySortOption: payload.sortOpt,
                    librarySortDirection: payload.sortDir,
                    sortedLibraryList: payload.allMaps
                })
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

    store.loadAllUserMaps = async function(userId) {

        const response = await api.getAllUserMaps(userId);
        if (response.data.success) {
            let userMaps = response.data.maps;
            storeReducer({
                type: GlobalStoreActionType.LOAD_ALL_USER_MAPS,
                payload: userMaps
            })
            return userMaps;
        }
        else {
            console.log("API FAILED TO FETCH USER MAPS.")
            console.log(response)
        }

    }

    store.loadAllUserAsCollaboratorMaps = async function(id) {
        const response = await api.getAllUserAsCollaboratorMaps(id);
        if (response.data.success) {
            let collabMaps = response.data.maps;
            console.log(collabMaps)
            storeReducer({
                type: GlobalStoreActionType.LOAD_ALL_USER_AS_COLLABORATOR_MAPS,
                payload: collabMaps
            })
            return collabMaps;
        }
        else {
            console.log("API FAILED TO FETCH USER AS COLLABORATOR MAPS.")
            console.log(response)
        }

    }

    store.loadUserAndCollabMaps = async function(id) {

        const response = await api.getUserAndCollabMaps({"id": id});
        if (response.data.success) {
            let userMaps = response.data.owner;
            let collabMaps = response.data.collaborator;
            storeReducer({
                type: GlobalStoreActionType.LOAD_USER_AND_COLLAB_MAPS,
                payload: {
                    userMaps: userMaps,
                    collabMaps: collabMaps
                }
            })
        }
        else {
            console.log("API FAILED TO FETCH USER AND COLLAB MAPS")
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


    store.setLibrarySort = async function (sortOpt, sortDir) {

        let allMaps = store.collabMaps.concat(store.userMaps)
        switch(sortOpt) {
            case 'name':
                if (sortDir === "up") {
                    allMaps.sort((map1, map2) => {
                        let a = map1.mapName
                        let b = map2.mapName
                        if (a > b) {
                            return 1;
                        }
                        else if (b > a) { 
                            return -1;
                        }
                        else {
                            return 0
                        }
                    });
                    storeReducer({
                        type: GlobalStoreActionType.SET_LIBRARY_SORTED_LIST,
                        payload: {
                            "allMaps": allMaps,
                            "sortDir": sortDir,
                            "sortOpt": sortOpt
                        }
                    })
                }
                else {
                    allMaps.sort((map1, map2) => {
                        let a = map1.mapName
                        let b = map2.mapName
                        if (a > b) {
                            return -1;
                        }
                        else if (b > a) { 
                            return 1;
                        }
                        else {
                            return 0
                        }
                    });
                    storeReducer({
                        type: GlobalStoreActionType.SET_LIBRARY_SORTED_LIST,
                        payload: {
                            "allMaps": allMaps,
                            "sortDir": sortDir,
                            "sortOpt": sortOpt
                        }
                    })
                }
                break;
            case 'date':
                if (sortDir === "up") {
                    allMaps.sort((map1, map2) => {
                        let a = map1.createdAt
                        let b = map2.createdAt
                        if (a > b) {
                            return 1;
                        }
                        else if (b > a) { 
                            return -1;
                        }
                        else {
                            return 0
                        }
                    });
                    storeReducer({
                        type: GlobalStoreActionType.SET_LIBRARY_SORTED_LIST,
                        payload: {
                            "allMaps": allMaps,
                            "sortDir": sortDir,
                            "sortOpt": sortOpt
                        }
                    })
                }
                else {
                    allMaps.sort((map1, map2) => {
                        let a = map1.createdAt
                        let b = map2.createdAt
                        if (a > b) {
                            return -1;
                        }
                        else if (b > a) { 
                            return 1;
                        }
                        else {
                            return 0
                        }
                    });
                    storeReducer({
                        type: GlobalStoreActionType.SET_LIBRARY_SORTED_LIST,
                        payload: {
                            "allMaps": allMaps,
                            "sortDir": sortDir,
                            "sortOpt": sortOpt
                        }
                    })
                }
                break;
            // case 'popular':
            //     if (sortDir === 'up') {
            //         allMaps.sort((map1, map2) => {
            //             let a = 0
            //             let b = 0
            //             if (map1.dislikes.length > 0) {
            //                 a = map1.likes.length / map1.dislikes.length
            //             }
            //             else {
            //                 a = map1.likes.length
            //             }
            //             if (map2.dislikes.length > 0) {
            //                 b = map2.likes.length / map2.dislikes.length
            //             }
            //             else {
            //                 b = map2.likes.length
            //             }
            //             if (a > b) {
            //                 return -1;
            //             }
            //             else if (b > a) { 
            //                 return 1;
            //             }
            //             else {
            //                 return 0
            //             }
            //         });
            //         storeReducer({
            //             type: GlobalStoreActionType.SET_LIBRARY_SORTED_LIST,
            //             payload: {
            //                 "allMaps": allMaps,
            //                 "sortDir": sortDir,
            //                 "sortOpt": sortOpt
            //             }
            //         })
            //     }
            //     else {
            //         allMaps.sort((map1, map2) => {
            //             let a = 0
            //             let b = 0
            //             if (map1.dislikes.length > 0) {
            //                 a = map1.likes.length / map1.dislikes.length
            //             }
            //             else {
            //                 a = map1.likes.length
            //             }
            //             if (map2.dislikes.length > 0) {
            //                 b = map2.likes.length / map2.dislikes.length
            //             }
            //             else {
            //                 b = map2.likes.length
            //             }
            //             if (a > b) {
            //                 return 1;
            //             }
            //             else if (b > a) { 
            //                 return -1;
            //             }
            //             else {
            //                 return 0
            //             }
            //         });
            //         storeReducer({
            //             type: GlobalStoreActionType.SET_LIBRARY_SORTED_LIST,
            //             payload: {
            //                 "allMaps": allMaps,
            //                 "sortDir": sortDir,
            //                 "sortOpt": sortOpt
            //             }
            //         })
            //     }
            //     break;
            case 'liked':
                if (sortDir === "up") {
                    allMaps.sort((map1, map2) => {
                        let a = map1.likes.length
                        let b = map2.likes.length
                        if (a > b) {
                            return 1;
                        }
                        else if (b > a) { 
                            return -1;
                        }
                        else {
                            return 0
                        }
                    });
                    storeReducer({
                        type: GlobalStoreActionType.SET_LIBRARY_SORTED_LIST,
                        payload: {
                            "allMaps": allMaps,
                            "sortDir": sortDir,
                            "sortOpt": sortOpt
                        }
                    })
                }
                else {
                    allMaps.sort((map1, map2) => {
                        let a = map1.likes.length
                        let b = map2.likes.length
                        if (a > b) {
                            return -1;
                        }
                        else if (b > a) { 
                            return 1;
                        }
                        else {
                            return 0
                        }
                    });
                    storeReducer({
                        type: GlobalStoreActionType.SET_LIBRARY_SORTED_LIST,
                        payload: {
                            "allMaps": allMaps,
                            "sortDir": sortDir,
                            "sortOpt": sortOpt
                        }
                    })
                }
                break;
            case 'size':
                if (sortDir === "up") {
                    allMaps.sort((map1, map2) => {
                        let a = map1.mapHeight * map1.mapWidth
                        let b = map2.mapHeight * map2.mapWidth
                        if (a > b) {
                            return 1;
                        }
                        else if (b > a) { 
                            return -1;
                        }
                        else {
                            return 0
                        }
                    });                    storeReducer({
                        type: GlobalStoreActionType.SET_LIBRARY_SORTED_LIST,
                        payload: {
                            "allMaps": allMaps,
                            "sortDir": sortDir,
                            "sortOpt": sortOpt
                        }
                    })
                }
                else {
                    allMaps.sort((map1, map2) => {
                        let a = map1.mapHeight * map1.mapWidth
                        let b = map2.mapHeight * map2.mapWidth
                        if (a > b) {
                            return -1;
                        }
                        else if (b > a) { 
                            return 1;
                        }
                        else {
                            return 0
                        }
                    });                    
                    storeReducer({
                        type: GlobalStoreActionType.SET_LIBRARY_SORTED_LIST,
                        payload: {
                            "allMaps": allMaps,
                            "sortDir": sortDir,
                            "sortOpt": sortOpt
                        }
                    })
                    storeReducer({
                        type: GlobalStoreActionType.SET_LIBRARY_SORTED_LIST,
                        payload: {
                            "allMaps": allMaps,
                            "sortDir": sortDir,
                            "sortOpt": sortOpt
                        }
                    })
                }
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


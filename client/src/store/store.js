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
    LOAD_PROJECT_COMMENTS: "LOAD_PROJECT_COMMENTS",
    SET_LIBRARY_SORTED_LIST: "SET_LIBRARY_SORTED_LIST",
    SET_EXPLORE_SORT: "SET_EXPLORE_SORT",
    SET_PAGINATION: "SET_PAGINATION",
}


function GlobalStoreContextProvider(props) {
    const navigate = useNavigate();


    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        publicProjects: [],
        projectComments: [],
        userMaps: [],
        collabMaps: [],
        userAndCollabMaps: [],
        librarySortOption: "",
        librarySortDirection: "",
        projSortOpt: "",
        projSortDir: "",
        sortedLibraryList: [],
        currentPage: "",
        mapOwner: null,
        searchName: "",
        pagination: {
            page: 1,
            limit: 10,
            stopPagination: false
        }
    });



    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);




    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        console.log(type)
        switch (type) {

            // GET ALL PUBLIC PROJECTS SO WE CAN PRESENT THEM IN EXPLORE SCREEN
            case GlobalStoreActionType.LOAD_PUBLIC_PROJECTS: {
                return setStore({
                    ...store,
                    publicProjects: payload,
                });
            }

            case GlobalStoreActionType.LOAD_ALL_USER_MAPS: {
                return setStore({
                    ...store,
                    userMaps: payload,
                })
            }

            case GlobalStoreActionType.LOAD_ALL_USER_AS_COLLABORATOR_MAPS: {
                return setStore({
                    ...store,
                    collabMaps: payload,
                })
            }

            case GlobalStoreActionType.LOAD_USER_AND_COLLAB_MAPS: {
                return setStore({
                    ...store,
                    userMaps: payload.userMaps,
                    collabMaps: payload.collabMaps,
                })
            }

            case GlobalStoreActionType.SET_CURRENT_PAGE: {
                console.log(store);
                console.log("in gsat", payload)
                return setStore({
                    ...store,
                    publicProjects: payload.publicProjects,
                    userMaps: payload.userMaps,
                    collabMaps: payload.collabMaps,
                    currentPage: payload.currentPage,
                });
            }

            case GlobalStoreActionType.SET_LIBRARY_SORTED_LIST: {
                return setStore({
                    ...store,
                    librarySortOption: payload.sortOpt,
                    librarySortDirection: payload.sortDir,
                    sortedLibraryList: payload.allMaps,
                });
            }

            case GlobalStoreActionType.LOAD_PROJECT_COMMENTS: {
                return setStore({
                    ...store,
                    librarySortOption: payload.sortOpt,
                    librarySortDirection: payload.sortDir,
                    sortedLibraryList: payload.allMaps,
                })
            }

            case GlobalStoreActionType.SET_EXPLORE_SORT: {
                return setStore({
                    ...store,
                    publicProjects: payload.publicProjects,
                    projSortOpt: payload.projSortOpt,
                    projSortDir: payload.projSortDir,
                })
            }

            case GlobalStoreActionType.SET_SEARCH_NAME: {
                return setStore({
                    ...store,
                    publicProjects: payload.publicProjects,
                    userMaps: payload.userMaps,
                    collabMaps: payload.collabMaps,
                    searchName: payload.newSearch
                });
            }

            case GlobalStoreActionType.SET_PAGINATION: {
                return setStore({
                    ...store,
                    pagination: payload.pagination,
                    publicProjects: payload.publicProjects,
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

        let page = store.pagination.page;
        let limit = store.pagination.limit;

        // Ahnaf is writing the getAllPublicProjects in the backend
        const response = await api.getAllPublicProjects({ page: page, limit: limit });
        console.log(response);
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

    store.loadAllUserMaps = async function (userId) {

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

    store.loadAllUserAsCollaboratorMaps = async function (id) {
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

    store.loadUserAndCollabMaps = async function (id) {

        const response = await api.getUserAndCollabMaps({ "id": id });
        if (response.data.success) {
            let userMaps = response.data.owner;
            let collabMaps = response.data.collaborator;
            storeReducer({
                type: GlobalStoreActionType.LOAD_USER_AND_COLLAB_MAPS,
                payload: {
                    currentPage: "library",
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
        let page = store.pagination.page;
        let limit = store.pagination.limit;
        const response = await api.getAllPublicProjects({ page: page, limit: limit });
        if (response.data.success) {
            console.log(response.data)
            let publicProjects = response.data.projects;
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_PAGE,
                payload: {
                    currentPage: "explore",
                    publicProjects: publicProjects,
                    userMaps: store.userMaps,
                    collabMaps: store.collabMaps,
                }
            });
        } else {
            console.log("API FAILED TO GET THE PUBLIC PROJECTS");
        }
    }


    store.changePageToLibrary = async function () {

        let id = "6357194e0a81cb803bbb913e"
        //let id = auth.user?._id

        const response = await api.getUserAndCollabMaps({ "id": id });
        if (response.data.success) {
            let userMaps = response.data.owner;
            let collabMaps = response.data.collaborator;
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_PAGE,
                payload: {
                    currentPage: "library",
                    userMaps: userMaps,
                    collabMaps: collabMaps,
                    publicProjects: store.publicProjects
                }
            })
        }
        else {
            console.log("API FAILED TO FETCH USER AND COLLAB MAPS")
        }
    }

    store.changePageToCommunity = async function () {

        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_PAGE,
            payload: {
                currentPage: "community",
                userMaps: store.userMaps,
                collabMaps: store.collabMaps,
                publicProjects: store.publicProjects
            }
        })
    }



    store.changeSearchName = async function (search) {
        console.log(store.currentPage)

        switch (store.currentPage) {

            case "explore": {
                const response = await api.getPublicProjectsByName(search);
                if (response.data.success) {
                    let publicProjects = response.data.projects;
                    storeReducer({
                        type: GlobalStoreActionType.SET_SEARCH_NAME,
                        payload: {
                            publicProjects: publicProjects,
                            newSearch: search,
                            userMaps: store.userMaps,
                            collabMaps: store.collabMaps
                        }
                    });
                } else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
                break;
            }

            case "library": {
                console.log("what the heck")
                let payload = {
                    id: "6357194e0a81cb803bbb913e",
                    name: search
                }
                const response = await api.getLibraryMapsByName(payload);

                if (response.data.success) {
                    console.log("success" + response);
                    let userMaps = response.data.owner;
                    let collabMaps = response.data.collaborator;
                    console.log(response.data)
                    storeReducer({
                        type: GlobalStoreActionType.SET_SEARCH_NAME,
                        payload: {
                            publicProjects: store.publicProjects,
                            newSearch: search,
                            userMaps: userMaps,
                            collabMaps: collabMaps

                        }
                    });
                } else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
                break;
            }



            // case "community" : {
            //     break;
            // }

            default: {
                return;
            }
        }
    }

    store.updateMapLikes = async function (id, setLikeDislikeCallback) {
        await api.getMapById(id).then(response => {
            let map = response.data.map;
            if (map.likes.includes(auth.user._id)) {
                let index = map.likes.indexOf(auth.user._id);
                map.likes.splice(index, 1);
            } else if (map.dislikes.includes(auth.user._id)) {
                let index = map.dislikes.indexOf(auth.user._id);
                map.dislikes.splice(index, 1);
                map.likes.push(auth.user._id);
            } else {
                map.likes.push(auth.user._id);
            }


            async function updatingMap(map) {
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

                if (response.data.success) {
                    setLikeDislikeCallback(map.likes, map.dislikes);
                    store.loadPublicProjects();
                }
            }

            updatingMap(map)
        });
    }



    store.updateMapDislikes = async function (id, setLikeDislikeCallback) {
        await api.getMapById(id).then(response => {
            let map = response.data.map;
            if (map.dislikes.includes(auth.user._id)) {
                let index = map.dislikes.indexOf(auth.user._id);
                map.dislikes.splice(index, 1);
            } else if (map.likes.includes(auth.user._id)) {
                let index = map.likes.indexOf(auth.user._id);
                map.likes.splice(index, 1);
                map.dislikes.push(auth.user._id);
            } else {
                map.dislikes.push(auth.user._id);
            }
            async function updatingMap(map) {
                let payload = {
                    likes: map.likes,
                    dislikes: map.dislikes
                };
                let query = {
                    id: map._id,
                    ownerId: auth.user._id
                }

                response = await api.updateMap(query, payload);

                if (response.data.success) {
                    setLikeDislikeCallback(map.likes, map.dislikes);
                    store.loadPublicProjects();
                }
            }
            updatingMap(map)
        });
    }


    store.updateMapFav = async function (id, setFavCallback) {
        await api.getMapById(id).then(response => {
            let map = response.data.map;
            if (map.favs.includes(auth.user._id)) {
                let index = map.favs.indexOf(auth.user._id);
                map.favs.splice(index, 1);
            } else {
                map.favs.push(auth.user._id);
            }

            async function updatingMap(map) {
                let payload = {
                    favs: map.favs
                };
                let query = {
                    id: map._id,
                    ownerId: auth.user._id
                }

                response = await api.updateMap(query, payload);

                if (response.data.success) {
                    setFavCallback(map.favs);
                    store.loadPublicProjects();
                }
            }
            updatingMap(map)
        });
    }

    store.createNewMap = async function (title, mapHeight, mapWidth, tileHeight, tileWidth, ownerId) {
        console.log("handling create map in store...")
        let payload = {
            title: title,
            mapHeight: mapHeight,
            mapWidth: mapWidth,
            tileHeight: tileHeight,
            tileWidth: tileWidth,
            ownerId: ownerId
        };
        let response = await api.createNewMap(payload)
        console.log(response)
    }

    store.createNewTileset = async function (title, tilesetHeight, tilesetWidth, tileHeight, tileWidth, ownerId) {
        console.log("handling create map in store...")
        console.log(title)
        console.log(tilesetHeight)
        console.log(tilesetWidth)
        console.log(tileHeight)
        console.log(tileWidth)
        console.log(ownerId)
        let payload = {
            title: title,
            imagePixelHeight: tilesetHeight,
            imagePixelWidth: tilesetWidth,
            tileHeight: tileHeight,
            tileWidth: tileWidth,
            ownerId: ownerId,
            isLocked: true,
            isPublic: false
        };
        let response = await api.createNewTileset(payload)
        console.log(response)
    }


    store.setLibrarySort = async function (sortOpt, sortDir) {

        let allMaps = store.collabMaps.concat(store.userMaps)

        switch (sortOpt) {
            case 'name':
                if (sortDir === "up") {
                    allMaps.sort((map1, map2) => {
                        let a = map1.title
                        let b = map2.title
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
                        let a = map1.title
                        let b = map2.title
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
                    }); storeReducer({
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

    }


    store.changeExploreSort = function (projSortOpt, projSortDir) {

        console.log(projSortOpt)
        console.log(projSortDir)
        let sortedProjects = store.sortProjects(store.publicProjects, projSortOpt, projSortDir);
        console.log(sortedProjects)

        storeReducer({
            type: GlobalStoreActionType.SET_EXPLORE_SORT,
            payload: {
                projSortOpt: projSortOpt,
                projSortDir: projSortDir,
                publicProjects: sortedProjects
            }
        });
    }



    store.sortProjects = function (list, sortOpt, sortDir) {

        console.log(sortOpt)
        console.log(sortDir)

        switch (sortOpt) {
            case 'Project Name':
                console.log("inside here at least")
                if (sortDir === "up") {
                    list.sort((proj1, proj2) => {
                        let a = proj1.title ? proj1.title : proj1.title
                        let b = proj1.title ? proj2.title : proj2.title
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
                }
                else {
                    list.sort((proj1, proj2) => {
                        let a = proj1.title ? proj1.title : proj1.title
                        let b = proj1.title ? proj2.title : proj2.title
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
                }
                return list;
            case 'Creation Date':
                if (sortDir === "up") {
                    list.sort((proj1, proj2) => {
                        let a = proj1.createdAt
                        let b = proj2.createdAt
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
                }
                else {
                    list.sort((proj1, proj2) => {
                        let a = proj1.createdAt
                        let b = proj2.createdAt
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
                }
                return list;
            case 'Most Liked':
                if (sortDir === "up") {
                    list.sort((proj1, proj2) => {
                        let a = proj1.likes.length
                        let b = proj2.likes.length
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
                }
                else {
                    list.sort((proj1, proj2) => {
                        let a = proj1.likes.length
                        let b = proj2.likes.length
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
                }
                return list;

            case 'Most Downloaded':
                if (sortDir === "up") {
                    list.sort((proj1, proj2) => {
                        let a = proj1.downloads.length
                        let b = proj2.downloads.length
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
                }
                else {
                    list.sort((proj1, proj2) => {
                        let a = proj1.downloads.length
                        let b = proj2.downloads.length
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
                }
                return list;
            // Probably change this to download size
            case 'Size':
                if (sortDir === "up") {
                    list.sort((proj1, proj2) => {
                        let a = proj1.mapHeight ? proj1.mapHeight * proj2.mapWidth : proj1.tiles.length * proj1.tileHeight * proj1.tileWidth;
                        let b = proj2.mapHeight ? proj2.mapHeight * proj2.mapWidth : proj2.tiles.length * proj2.tileHeight * proj2.tileWidth;
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
                }
                else {
                    list.sort((proj1, proj2) => {
                        let a = proj1.mapHeight ? proj1.mapHeight * proj2.mapWidth : proj1.tiles.length * proj1.tileHeight * proj1.tileWidth;
                        let b = proj2.mapHeight ? proj2.mapHeight * proj2.mapWidth : proj2.tiles.length * proj2.tileHeight * proj2.tileWidth;
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
                }
                return list;
        }

    }




    store.updateTilesetLikes = async function (id, setLikeDislikeCallback) {
        await api.getTilesetById(id).then(response => {
            let tileset = response.data.tileset;
            if (tileset.likes.includes(auth.user._id)) {
                let index = tileset.likes.indexOf(auth.user._id);
                tileset.likes.splice(index, 1);
            } else if (tileset.dislikes.includes(auth.user._id)) {
                let index = tileset.dislikes.indexOf(auth.user._id);
                tileset.dislikes.splice(index, 1);
                tileset.likes.push(auth.user._id);
            } else {
                tileset.likes.push(auth.user._id);
            }


            async function updatingTileset(tileset) {
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

                if (response.data.success) {
                    setLikeDislikeCallback(tileset.likes, tileset.dislikes);
                    store.loadPublicProjects();
                }
            }

            updatingTileset(tileset)
        });
    }



    store.updateTilesetDislikes = async function (id, setLikeDislikeCallback) {
        await api.getTilesetById(id).then(response => {
            let tileset = response.data.tileset;
            if (tileset.dislikes.includes(auth.user._id)) {
                let index = tileset.dislikes.indexOf(auth.user._id);
                tileset.dislikes.splice(index, 1);
            } else if (tileset.likes.includes(auth.user._id)) {
                let index = tileset.likes.indexOf(auth.user._id);
                tileset.likes.splice(index, 1);
                tileset.dislikes.push(auth.user._id);
            } else {
                tileset.dislikes.push(auth.user._id);
            }
            async function updatingTileset(tileset) {
                let payload = {
                    likes: tileset.likes,
                    dislikes: tileset.dislikes
                };
                let query = {
                    id: tileset._id,
                    ownerId: auth.user._id
                }

                response = await api.updateTileset(query, payload);

                if (response.data.success) {
                    setLikeDislikeCallback(tileset.likes, tileset.dislikes);
                    store.loadPublicProjects();
                }
            }
            updatingTileset(tileset)
        });
    }


    store.updateTilesetFav = async function (id, setFavCallback) {
        await api.getTilesetById(id).then(response => {
            let tileset = response.data.tileset;
            if (tileset.favs.includes(auth.user._id)) {
                let index = tileset.favs.indexOf(auth.user._id);
                tileset.favs.splice(index, 1);
            } else {
                tileset.favs.push(auth.user._id);
            }

            async function updatingTileset(tileset) {
                let payload = {
                    favs: tileset.favs
                };
                let query = {
                    id: tileset._id,
                    ownerId: auth.user._id
                }

                response = await api.updateTileset(query, payload);

                if (response.data.success) {
                    setFavCallback(tileset.favs);
                    store.loadPublicProjects();
                }
            }
            updatingTileset(tileset)
        });

    }

    store.updateCommentLikes = async function (id, setLikeDislikeCallback) {
        await api.getCommentbyId(id).then(response => {
            // console.log(response)
            let comment = response.data.comment;
            if (comment.likes.includes(auth.user._id)) {
                let index = comment.likes.indexOf(auth.user._id);
                comment.likes.splice(index, 1);
            } else if (comment.dislikes.includes(auth.user._id)) {
                let index = comment.dislikes.indexOf(auth.user._id);
                comment.dislikes.splice(index, 1);
                comment.likes.push(auth.user._id);
            } else {
                comment.likes.push(auth.user._id);
            }


            async function updatingComment(comment) {
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

                if (response.data.success) {
                    setLikeDislikeCallback(comment.likes, comment.dislikes);
                    store.loadPublicProjectComments();
                }
            }

            updatingComment(comment)
        });
    }

    store.updateCommentDislikes = async function (id, setLikeDislikeCallback) {
        await api.getCommentbyId(id).then(response => {
            console.log("hello");
            let comment = response.data.comment;
            if (comment.dislikes.includes(auth.user._id)) {
                let index = comment.dislikes.indexOf(auth.user._id);
                comment.dislikes.splice(index, 1);
            } else if (comment.likes.includes(auth.user._id)) {
                let index = comment.likes.indexOf(auth.user._id);
                comment.likes.splice(index, 1);
                comment.dislikes.push(auth.user._id);
            } else {
                comment.dislikes.push(auth.user._id);
            }
            async function updatingComment(comment) {
                let payload = {
                    likes: comment.likes,
                    dislikes: comment.dislikes
                };
                let query = {
                    id: comment._id,
                    ownerId: auth.user._id
                }

                response = await api.updateComment(query, payload);

                if (response.data.success) {
                    setLikeDislikeCallback(comment.likes, comment.dislikes);
                    store.loadPublicProjectComments();
                }
            }
            updatingComment(comment)
        });
    }

    store.changePagination = async function (page, limit) {
        const response = await api.getAllPublicProjects({ page: page + 1, limit: limit });
        const nextResponse = await api.getAllPublicProjects({ page: page + 2, limit: limit });
        let paginate = { page: page + 1, limit: limit, stopPagination: false };
        if (nextResponse.data.projects.length === 0) {
            paginate = { ...paginate, page: page, stopPagination: true };
        }
        storeReducer({
            type: GlobalStoreActionType.SET_PAGINATION,
            payload: {
                publicProjects: response.data.projects,
                pagination: paginate
            }
        });
    store.getUserById = async function (id, setOwnerCallback) {
        const response = await api.getUserById(id);
        if(response.status === 200){
            console.log(response.data)
            setOwnerCallback(response.data.user)
            //return response.data.user;
        }
    } 


    store.editMapRequest = async function (receiverId, mapId, title) {
        let payload = {
            senderId: auth.user._id, 
            receiverId: receiverId, 
            mapId: mapId, 
            title: title
        }

        const response = await api.requestMapEdit(payload);
        if (response.data.success) {
            console.log(response)
            return
        }
        else {
            console.log("API FAILED TO SEND NOTIFICATION")
        }
    }


    store.editMapRequest = async function (receiverId, tilesetId, title) {
        let payload = {
            senderId: auth.user._id, 
            receiverId: receiverId, 
            tilsetId: tilesetId, 
            title: title
        }

        const response = await api.requestTilesetEdit(payload); 
        if (response.data.success) {
            console.log(response)
            return
        }
        else {
            console.log("API FAILED TO SEND NOTIFICATION")
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


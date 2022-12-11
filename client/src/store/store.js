import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/api'
import AuthContext from '../auth/auth'

export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    LOAD_PUBLIC_PROJECTS: "LOAD_PUBLIC_PROJECTS",
    LOAD_USER_PROJECTS: "LOAD_USER_PROJECTS",
    SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
    LOAD_USER_FAVORITES: "LOAD_USER_FAVORITES",
    GET_MAP_OWNER: "GET_MAP_OWNER",
    LOAD_PROJECT_COMMENTS: "LOAD_PROJECT_COMMENTS",

    SET_LIBRARY_SORTED_LIST: "SET_LIBRARY_SORTED_LIST",

    SET_EXPLORE_SORT: "SET_EXPLORE_SORT",
    SET_LIBRARY_SORT: "SET_LIBRARY_SORT",
    SET_PAGINATION: "SET_PAGINATION",
    SET_PRIMARY_COLOR: "SET_PRIMARY_COLOR",
    SET_SECONDARY_COLOR: "SET_SECONDARY_COLOR",
    SET_TILESET_TOOL: "SET_TILESET_TOOL",
    SWAP_COLORS: "SWAP_COLORS",
    SET_PRIMARY_TILE: "SET_PRIMARY_TILE",
    SET_SECONDARY_TILE: "SET_SECONDARY_TILE",
    SWAP_TILES: "SWAP_TILES",
    LOAD_TILESET: "LOAD_TILESET",
    SET_CURRENT_TILE: "SET_CURRENT_TILE",
    ADD_TILE_TO_CURRENT_TILESET: "ADD_TILE_TO_CURRENT_TILESET",
    SET_CURRENT_PROJECT: "SET_CURRENT_PROJECT",
    IMPORT_TILESET_TO_TILESET: "IMPORT_TILESET_TO_TILESET",
    IMPORT_TILESET_TO_MAP: "IMPORT_TILESET_TO_MAP",
    SET_CURRENT_MAP_TILES: 'SET_CURRENT_MAP_TILES',
    LOAD_MAP: 'LOAD_MAP',
    CLEAR_STORE: "CLEAR_STORE",

    SET_CURRENT_PROJECT_AND_TILE: 'SET_CURRENT_PROJECT_AND_TILE',
    DELETE_TILESET_FROM_MAP: 'DELETE_TILESET_FROM_MAP',

    UPDATE_TRANSACTION: "UPDATE_TRANSACTION",
    CLEAR_TRANSACTION_STACK: "CLEAR_TRANSACTION_STACK"
}


function GlobalStoreContextProvider(props) {
    const navigate = useNavigate();


    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        publicProjects: [],
        userProjects: [],
        projectComments: [],
        currentPage: "",

        // map or tile
        currentProject: null,

        // for tileset editor
        currentTile: null,
        primaryColor: '#000000',
        secondaryColor: '#ffffff',

        // for map editor
        mapTilesets: [],
        mapTiles: [],
        currentMapTiles: [],
        primaryTile: -1,
        secondaryTile: -1,


        // for both map and tileset editor
        tilesetTool: 'brush',
        userFavs: {
            maps: [],
            tilesets: []
        },
        projSortOpt: "",
        projSortDir: "",
        searchName: "",
        pagination: {
            page: 1,
            limit: 10,
            stopPagination: false,
            sort: 'date',
            order: -1
        },


        // i think redundant
        mapOwner: null,
        librarySortOption: "",
        librarySortDirection: "",
        sortedLibraryList: [],

        //undo redo
       transactionStack: [],
       currentStackIndex: -1,
       canRedo: false,
       canUndo: false

    });



    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);




    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        // console.log(type)
        // console.log(payload)
        switch (type) {

            case GlobalStoreActionType.UPDATE_TRANSACTION: {
                console.log("updating transaction stack to")
                console.log(payload)
                return setStore({
                    ...store,
                    transactionStack: payload.updatedStack,
                    canRedo: payload.canRedo,
                    canUndo: payload.canUndo,
                    currentStackIndex: payload.currentStackIndex
                })
            }
  
            case GlobalStoreActionType.CLEAR_TRANSACTION_STACK: {
                console.log("CLEARING TRANSACTION STACK RIGHT NOWWWWWWW")
                return setStore({
                    ...store,
                    transactionStack: [],
                    currentStackIndex: -1,
                    canRedo: false,
                    canUndo: false
                })
            }

            // GET ALL PUBLIC PROJECTS SO WE CAN PRESENT THEM IN EXPLORE SCREEN
            case GlobalStoreActionType.LOAD_PUBLIC_PROJECTS: {
                return setStore({
                    ...store,
                    publicProjects: payload,
                });
            }

            case GlobalStoreActionType.LOAD_USER_PROJECTS: {
                return setStore({
                    ...store,
                    userProjects: payload,
                });
            }

            case GlobalStoreActionType.LOAD_USER_FAVORITES: {
                return setStore({
                    ...store,
                    userFavs: payload
                })
            }


            case GlobalStoreActionType.IMPORT_TILESET_TO_TILESET: {
                return setStore({
                    ...store,
                    currentProject: payload,
                })
            }

            case GlobalStoreActionType.IMPORT_TILESET_TO_MAP: {
                return setStore({
                    ...store,
                    currentProject: payload.currentProject,
                    mapTilesets: payload.mapTilesets,
                    mapTiles: payload.mapTiles,
                    
                })
            }

            case GlobalStoreActionType.SET_CURRENT_PAGE: {
                console.log(store);
                return setStore({
                    ...store,
                    currentTile: payload.currentTile,
                    currentProject: payload.currentProject,
                    publicProjects: payload.publicProjects,
                    currentPage: payload.currentPage,
                    userProjects: payload.userProjects
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
                    projectComments: payload,
                })
            }

            case GlobalStoreActionType.SET_EXPLORE_SORT: {
                return setStore({
                    ...store,
                    projSortOpt: payload.projSortOpt,
                    projSortDir: payload.projSortDir,
                })
            }

            case GlobalStoreActionType.SET_LIBRARY_SORT: {
                return setStore({
                    ...store,
                    userProjects: payload.userProjects,
                    projSortOpt: payload.projSortOpt,
                    projSortDir: payload.projSortDir,
                })
            }

            case GlobalStoreActionType.SET_SEARCH_NAME: {
                return setStore({
                    ...store,
                    publicProjects: payload.publicProjects,
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

            case GlobalStoreActionType.SET_PRIMARY_COLOR: {
                return setStore({
                    ...store,
                    primaryColor: payload.newPrimaryColor
                })
            }

            case GlobalStoreActionType.SET_SECONDARY_COLOR: {
                return setStore({
                    ...store,
                    secondaryColor: payload.newSecondaryColor
                })
            }

            case GlobalStoreActionType.SET_PRIMARY_TILE: {
                console.log("STORE SETTING PRIMARY TILE")
                console.log(payload.newPrimaryTile)
                return setStore({
                    ...store,
                    primaryTile: payload.newPrimaryTile
                })
            }

            case GlobalStoreActionType.SET_SECONDARY_TILE: {
                return setStore({
                    ...store,
                    secondaryTile: payload.newSecondaryTile
                })
            }

            case GlobalStoreActionType.SET_TILESET_TOOL: {
                return setStore({
                    ...store,
                    tilesetTool: payload.newTilesetTool
                })
            }

            case GlobalStoreActionType.SWAP_COLORS: {

                return setStore({
                    ...store,
                    primaryColor: payload.newPrimary,
                    secondaryColor: payload.newSecondary
                })
            }

            case GlobalStoreActionType.SWAP_TILES: {
                console.log("SWAP_TILES: payload")
                console.log(payload)
                return setStore({
                    ...store,
                    primaryTile: payload.newPrimary,
                    secondaryTile: payload.newSecondary
                })
            }

            case GlobalStoreActionType.LOAD_TILESET: {
                return setStore({
                    ...store,
                    currentPage: "tilesetEditor",
                    currentProject: payload.currentProject,
                    currentTile: payload.currentTile,
                    primaryColor: '#000',
                   secondaryColor: '#fff',
                   tilesetTool: 'brush',
                })
            }

            case GlobalStoreActionType.LOAD_MAP: {
                return setStore({
                    ...store,
                    currentPage: "tilesetEditor",
                    currentProject: payload.currentProject,
                    primaryTile: payload.primaryTile,
                    secondaryTile: payload.secondaryTile,
                    tilesetTool: payload.tilesetTool,
                    mapTilesets: payload.mapTilesets,
                    mapTiles: payload.mapTiles,
                    currentMapTiles: payload.currentMapTiles,

                })
            }

            case GlobalStoreActionType.SET_CURRENT_TILE: {
                return setStore({
                    ...store,
                    currentTile: payload.currentTile
                })
            }

            case GlobalStoreActionType.SET_CURRENT_PROJECT_AND_TILE: {
                return setStore({
                    ...store,
                    currentProject: payload.currentProject,
                    currentTile: payload.currentTile
                })
            }

            case GlobalStoreActionType.SET_CURRENT_PROJECT: {
                console.log('setting current project')
                return setStore({
                    ...store,
                    currentProject: payload.currentProject
                })
            }

            case GlobalStoreActionType.UPDATE_TILE: {
                return setStore({
                    ...store,
                    currentTile: payload.tile
                })
            }

            case GlobalStoreActionType.ADD_TILE_TO_CURRENT_TILESET: {
                return setStore({
                    ...store,
                    currentPage: "tilesetEditor",
                    currentProject: payload.tileset,
                    currentTile: payload.tile
                })
            }

            case GlobalStoreActionType.DELETE_TILESET_FROM_MAP: {
                return setStore({
                    ...store,
                    currentProject: payload.currentProject,
                    mapTilesets: payload.mapTilesets,
                    mapTiles: payload.mapTiles,
                    primaryTile: payload.primaryTile,
                    secondaryTile: payload.secondaryTile,
                    currentMapTiles: payload.currentMapTiles,
                })
            }

            case GlobalStoreActionType.SET_CURRENT_MAP_TILES: {
                console.log("PAYLOAD CURRENT MAP TILES")
                console.log(payload.currentMapTiles)
                return setStore({
                    ...store,
                    currentMapTiles: payload.currentMapTiles
                })
            }

            case GlobalStoreActionType.CLEAR_STORE: {
                return setStore({
                    publicProjects: [],
                    projectComments: [],
                    currentProject: null,
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
                        stopPagination: false,
                        sort: 'date',
                        order: -1
                    },
                    primaryColor: '#000000',
                    secondaryColor: '#ffffff',
                    tilesetTool: 'brush',
                    currentTile: null,
                    mapTilesets: [],
                    mapTiles: [],
                    currentMapTiles: []
                });
            }

            default:
                return store;
        }
    }















    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    
    // ----------------------------------------- TRANSACTION STACK ------------------------------------------------
    store.addTransaction = async function (oldData, newData) {
    
        if (store.transactionStack.length === 0) {
            storeReducer({
                type: GlobalStoreActionType.UPDATE_TRANSACTION,
                payload: {
                    updatedStack: [
                        {"old": oldData, "new": newData},
                    ],
                    canRedo: false,
                    canUndo: true,
                    currentStackIndex: 0,
                }
            })
            return
        }

        let tstack = store.transactionStack
        tstack = tstack.slice(0, store.currentStackIndex + 1)

        tstack.push(
            {"old": oldData, "new": newData},
        )

        let currentStackIndex = store.currentStackIndex + 1
        let canRedo = false
        let canUndo = true

        storeReducer({
            type: GlobalStoreActionType.UPDATE_TRANSACTION,
            payload: {
                updatedStack: tstack,
                canRedo: canRedo,
                canUndo: canUndo,
                currentStackIndex: currentStackIndex,
            }
        })


    }

    store.redo = async function () {
        console.log("Redo")
        console.log(this.transactionStack)
        let newStackIndex = store.currentStackIndex + 1
        let canRedo = newStackIndex < store.transactionStack.length - 1
        let canUndo = newStackIndex > -1

        storeReducer({
            type: GlobalStoreActionType.UPDATE_TRANSACTION,
            payload: {
                updatedStack: store.transactionStack,
                canRedo: canRedo,
                canUndo: canUndo,
                currentStackIndex: newStackIndex,
            }
        });

        console.log(this.transactionStack)
    }

    store.undo = async function() {
        console.log("Undo")
        let newStackIndex = store.currentStackIndex - 1
        let canRedo = newStackIndex < store.transactionStack.length - 1
        let canUndo = newStackIndex > -1

        storeReducer({
            type: GlobalStoreActionType.UPDATE_TRANSACTION,
            payload: {
                updatedStack: store.transactionStack,
                canRedo: canRedo,
                canUndo: canUndo,
                currentStackIndex: newStackIndex,
            }
        });
    }
    
    store.clearTransactionStack = async function () {
        console.log("transaction stack cleared")
        storeReducer({
            type: GlobalStoreActionType.UPDATE_TRANSACTION,
            payload: {
                updatedStack: [],
                canRedo: false,
                canUndo: false,
                currentStackIndex: -1,
            }
        });
    }


    // -----------------------------------------  GET PROJECTS  ---------------------------------------------------

    // GET all projects for EXPLORE
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

    // GET all projects for LIBRARY 
    store.loadUserProjects = async function (userId) {

        //let page = store.pagination.page;
        //let limit = store.pagination.limit;

        const response = await api.getAllUserProjects({ userId: userId });
        console.log(response);
        if (response.data.success) {
            let userProjects = response.data.projects;
            storeReducer({
                type: GlobalStoreActionType.LOAD_USER_PROJECTS,
                payload: userProjects
            });
        } else {
            console.log("API FAILED TO GET THE USER PROJECTS");
        }

    }

    // GET ALL TILES OF A TILESET
    store.getTilesetTiles = async function (tilesetId) {
        const response = await api.getTilesetTiles(tilesetId)

        if (response.status === 200) {
            console.log(response.data.tiles)
            return response.data.tiles
        }
    }

    // GET ALL TILES OF A MAP
    // store.getMapTiles = async function (tilesetIds) {

    //     const response = await api.getTilesetTiles(tilesetIds)

    //     if (response.status === 200) {
    //         console.log(response.data.tiles)
    //         return response.data.tiles
    //     }
    // }

    // GET all user favourited projects
    store.loadFavorites = async function (id, filter) {
        let payload = {
            id: id,
            filteredId: filter,
            tileHeight: store.currentProject.tileHeight,
            tileWidth: store.currentProject.tileWidth
        };
        const response = await api.getFavorites(payload);

        let tilesets = response.data.tilesets

        
        // filter tilesets with empty tiles!
        tilesets = await tilesets.reduce(async (acc, tileset) => {
            let empty = false
            
            let tiles = await store.getTilesetTiles(tileset._id)
            tiles.every((tileObj) => {
                let tileData = tileObj.tileData
            
                if (tileData.every(pixel => pixel === '')) {
                    // cannot import tileset with empty tile
                    empty = true
                    return false
                }
                return true
            })

            if (empty == true){
                return acc
            } else {
                return (await acc).concat(tileset)
            }
        }, [])
        
        //console.log(tilesets)
        //console.log(response)

        if (response.status < 400) {
            storeReducer({
                type: GlobalStoreActionType.LOAD_USER_FAVORITES,
                payload: {
                    maps: response.data.maps,
                    tilesets: tilesets
                }
            })
        }
    }

    store.getTilesetById = async function (id) {
        const response = await api.getTilesetById(id)

        if (response.status === 200) {
            console.log("Got Tileset")
            console.log(response.data.tileset)

            return response.data.tileset
        }
        else {
            console.log("LOADING TILESET FAILED")
        }
    }


    store.getMapTilesets = async function (id) {
        console.log(id)
        const response = await api.getMapTilesets(id)

        if (response.status === 200) {
            console.log(response.data.tilesets)
            return response.data.tilesets
        }
        else {
            console.log("LOADING TILESET FAILED")
        }
    }



    // TOMMYS OLD CODE FOR LIBRARY
    // store.loadAllUserMaps = async function (userId) {
    //     const response = await api.getAllUserMaps(userId);
    //     if (response.data.success) {
    //         let userMaps = response.data.maps;
    //         storeReducer({
    //             type: GlobalStoreActionType.LOAD_ALL_USER_MAPS,
    //             payload: userMaps
    //         })
    //         return userMaps;
    //     }
    //     else {
    //         console.log("API FAILED TO FETCH USER MAPS.")
    //         console.log(response)
    //     }
    // }

    // store.loadAllUserAsCollaboratorMaps = async function (id) {
    //     const response = await api.getAllUserAsCollaboratorMaps(id);
    //     if (response.data.success) {
    //         let collabMaps = response.data.maps;
    //         console.log(collabMaps)
    //         storeReducer({
    //             type: GlobalStoreActionType.LOAD_ALL_USER_AS_COLLABORATOR_MAPS,
    //             payload: collabMaps
    //         })
    //         return collabMaps;
    //     }
    //     else {
    //         console.log("API FAILED TO FETCH USER AS COLLABORATOR MAPS.")
    //         console.log(response)
    //     }
    // }

    // store.loadUserAndCollabMaps = async function (id) {
    //     const response = await api.getUserAndCollabMaps({ "id": id });
    //     if (response.data.success) {
    //         let userMaps = response.data.owner;
    //         let collabMaps = response.data.collaborator;
    //         storeReducer({
    //             type: GlobalStoreActionType.LOAD_USER_AND_COLLAB_MAPS,
    //             payload: {
    //                 currentPage: "library",
    //                 userMaps: userMaps,
    //                 collabMaps: collabMaps
    //             }
    //         })
    //     }
    //     else {
    //         console.log("API FAILED TO FETCH USER AND COLLAB MAPS")
    //     }
    // }











    // -----------------------------------------    IMPORTING  ---------------------------------------------------

    store.importTilesetToTileset = async function (importedProjectId) {
        let payload = {
            importId: importedProjectId,
            tilesetId: store.currentProject._id
        }
        const response = await api.importTilesetToTileset(payload);
        console.log(response);
        if (response.status < 400) {
            storeReducer({
                type: GlobalStoreActionType.IMPORT_TILESET_TO_TILESET,
                payload: response.data.tileset
            })
        }
    }

    store.importTilesetToCopyTileset = async function (importedProjectId, tilesetId) {
        let payload = {
            importId: importedProjectId,
            tilesetId: tilesetId,
        }
        const response = await api.importTilesetToTileset(payload);
        console.log(response);
        if (response.status < 400) {
            return response.data.tileset
        }
    }


    store.importTilesetToMap = async function (importedId) {
        let payload = {
            tilesetId: importedId,
            mapId: store.currentProject._id
        }
        const response = await api.importTilesetToMap(payload);
        console.log(response);
        if (response.status < 400) {


            const response2 = await api.getMapTilesets(response.data.map._id)

            let mapTilesets;
            let mapTiles;

            let mapTilesetsOrdered = []
            let mapTilesOrdered = []
            let sorting = response.data.map.tilesets


            if (response2.status === 200) {
                mapTilesets = response2.data.tilesets;
                mapTiles = response2.data.tiles;

                sorting.forEach(function(id) {
                    var found = false;
                    mapTilesets = mapTilesets.filter(function(tileset) {
                        if(!found && tileset._id == id) {
                            mapTilesetsOrdered.push(tileset);
                            found = true;
                            return false;
                        } else 
                            return true;
                    })
                })

                sorting.forEach(function(id) {
                    mapTiles = mapTiles.filter(function(tile) {
                        if(tile.tilesetId == id) {
                            mapTilesOrdered.push(tile);
                            return false;
                        } else 
                            return true;
                    })
                })


                storeReducer({
                    type: GlobalStoreActionType.IMPORT_TILESET_TO_MAP,
                    payload: {
                        currentProject: response.data.map,
                        mapTilesets: mapTilesetsOrdered,
                        mapTiles: mapTilesOrdered,
                    }
                })
            }

            // let mapTilesets = await store.getMapTilesets(response.data.map._id)
            // let mapTiles = [];
            // let tileIds = [];

            // for (let i = 0; i < mapTilesets.length; i++) {
            //     tileIds = tileIds.concat(mapTilesets[i].tiles)
            // }

            // await Promise.all(tileIds.map(async (tileId) => {
            //     let tile = await store.getTileById(tileId)
            //     mapTiles.push(tile)
            // }));

        }
    }













    // -----------------------------------------    NAVIGATION  ---------------------------------------------------

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
                    currentProject: null,
                    currentTile: null,
                    currentPage: "explore",
                    userProjects: store.userProjects,
                    publicProjects: publicProjects,
                }
            });

            console.log(store.currentPage)
        } else {
            console.log("API FAILED TO GET THE PUBLIC PROJECTS");
        }
    }


    store.changePageToLibrary = async function () {

        // let id = "6357194e0a81cb803bbb913e"
        let id = auth.user?._id

        const response = await api.getAllUserProjects({ "userId": id });
        if (response.data.success) {
            console.log(response);
            let userProjects = response.data.projects;
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_PAGE,
                payload: {
                    currentProject: null,
                    currentTile: null,
                    currentPage: "library",
                    userProjects: userProjects,
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
                currentProject: null,
                currentTile: null,
                currentPage: "community",
                userProjects: store.userProjects,
                publicProjects: store.publicProjects
            }
        })
    }

    store.changePageToProfile = async function () {

        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_PAGE,
            payload: {
                currentProject: null,
                currentTile: null,
                currentPage: "profile",
                userProjects: store.userProjects,
                publicProjects: store.publicProjects
            }
        })
    }

    store.changePageToMapEditor = async function (map) {

        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_PAGE,
            payload: {
                currentProject: map,
                currentTile: null,
                currentPage: "mapEditor",
                userProjects: store.userProjects,
                publicProjects: store.publicProjects
            }
        })
    }

    store.changePageToTilesetEditor = async function (tileset) {
        console.log('changing page to tileset')
        console.log(tileset)

        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_PAGE,
            payload: {
                currentProject: tileset,
                currentTile: store.currentTile,
                currentPage: "tilesetEditor",
                userProjects: store.userProjects,
                publicProjects: store.publicProjects
            }
        })

        console.log(store.currentPage)
    }














    // -----------------------------------------   CREATE/DELETE PROJECTS  ---------------------------------------------------



    store.createNewMap = async function (title, mapHeight, mapWidth, tileHeight, tileWidth, ownerId) {
        console.log("handling create map in store...")
        let payload = {
            title: title,
            mapHeight: mapHeight,
            mapWidth: mapWidth,
            tileHeight: tileHeight,
            tileWidth: tileWidth,
            ownerId: ownerId,
            mapDescription: "No Description"
        };
        let response = await api.createNewMap(payload)
        console.log(response)
        return response;
    }

    store.deleteMap = async function (id) {
        console.log(id)
        let query = {
            id: id,
            ownerId: auth.user._id
        }
        let response = await api.deleteMap(query)
        console.log(response);
        store.changePageToLibrary();
        return response;
    }

    store.createNewTileset = async function (title, tilesetHeight, tilesetWidth, tileHeight, tileWidth, ownerId, locked) {
        let isLocked = false
        if (locked !== undefined) {
            isLocked = locked;
        }

        let payload = {
            title: title,
            imagePixelHeight: tilesetHeight,
            imagePixelWidth: tilesetWidth,
            tileHeight: tileHeight,
            tileWidth: tileWidth,
            ownerId: ownerId,
            isLocked: isLocked,
            isPublic: false,
            source: null
        };
        let response = await api.createNewTileset(payload)
        console.log(response)
        return response;
    }

    store.deleteTileset = async function (id) {
        console.log(id)
        let query = {
            id: id,
            ownerId: auth.user?._id,
        }
        let response = await api.deleteTileset(query)
        console.log(response);
        store.changePageToLibrary();
        return response;
    }

















    // -----------------------------------------    PUBLISH/UNPUBLISH  ---------------------------------------------------


    store.publishMap = async function () {
        let query = {
            id: store.currentProject._id,
            ownerId: auth.user?._id
        }
        const response = await api.publishMap(query, { isPublic: true });
        console.log(response.data)
        if (response.data.success) {
            store.changePageToMapEditor(response.data.map)
        }
        else {
            console.log("API FAILED TO PUBLISH MAP.")
            console.log(response)
        }

    }

    store.unpublishMap = async function () {
        let query = {
            id: store.currentProject._id,
            ownerId: auth.user?._id
        }
        const response = await api.publishMap(query, { isPublic: false });
        if (response.data.success) {
            store.changePageToMapEditor(response.data.map)
        }
        else {
            console.log("API FAILED TO PUBLISH MAP.")
            console.log(response)
        }

    }


    store.publishTileset = async function () {
        let query = {
            id: store.currentProject._id,
            ownerId: auth.user?._id
        }
        const response = await api.publishTileset(query, { isPublic: true });
        console.log(response.data)
        if (response.data.success) {
            store.changePageToTilesetEditor(response.data.tileset)
        }
        else {
            console.log("API FAILED TO PUBLISH TILESET.")
            console.log(response)
        }

    }

    store.unpublishTileset = async function () {
        let query = {
            id: store.currentProject._id,
            ownerId: auth.user?._id
        }
        const response = await api.publishTileset(query, { isPublic: false });
        if (response.data.success) {
            store.changePageToTilesetEditor(response.data.tileset)
        }
        else {
            console.log("API FAILED TO PUBLISH TILESET.")
            console.log(response)
        }

    }


















    // ----------------------------------------    LIKE/DISLIKE/FAV   -----------------------------------------------------



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














    // -----------------------------------------    EDIT REQUESTS  ---------------------------------------------------


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


    store.editTilesetRequest = async function (receiverId, tilesetId, title) {
        let payload = {
            senderId: auth.user._id,
            receiverId: receiverId,
            tilesetId: tilesetId,
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









    // -----------------------------------------    ADD/REMOVE COLLABORATOS  ---------------------------------------------------

    store.addMapCollaborator = async function (mapId, collaboratorId) {
        let payload = {
            mapId: mapId,
            requesterId: collaboratorId
        }

        const response = await api.addMapCollaborator(payload);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_PAGE,
                payload: {
                    currentProject: response.data.map,
                    currentPage: "mapEditor",
                    publicProjects: store.publicProjects
                }
            })
        }
        else {
            // TODO: display message to alert user like already collaborator
            console.log("API FAILED TO ADD COLLABORATOR")
        }

    }

    store.removeMapCollaborator = async function (mapId, collaboratorId) {
        let payload = {
            mapId: mapId,
            requesterId: collaboratorId
        }

        const response = await api.removeMapCollaborator(payload);
        if (response.data.success) {

            let currentMap = response.data.map
            //console.log(newMap)
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_PAGE,
                payload: {
                    currentProject: currentMap,
                    currentPage: "mapEditor",
                    publicProjects: store.publicProjects
                }
            })
            //store.changePageToMapEditor(currentMap)
            console.log(store.currentProject)
            return currentMap;
        }
        else {
            console.log("API FAILED TO REMOVE COLLABORATOR")
        }
    }

    store.addTilesetCollaborator = async function (tilesetId, userId) {
        let payload = {
            tilesetId: tilesetId,
            userId: userId
        }

        const response = await api.addTilesetCollaborator(payload);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_PAGE,
                payload: {
                    currentProject: response.data.tileset,
                    currentPage: "tilesetEditor",
                    publicProjects: store.publicProjects
                }
            })
        }
        else {
            console.log("API FAILED TO ADD COLLABORATOR")
        }
    }

    store.removeTilesetCollaborator = async function (tilesetId, userId) {
        let payload = {
            tilesetId: tilesetId,
            userId: userId
        }

        const response = await api.removeTilesetCollaborator(payload);
        if (response.data.success) {
            console.log(response.data.tileset)
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_PAGE,
                payload: {
                    currentProject: response.data.tileset,
                    currentPage: "tilesetEditor",
                    publicProjects: store.publicProjects
                }
            })
        }
        else {
            console.log("API FAILED TO REMOVE COLLABORATOR")
        }

    }















    // -----------------------------------------    SEARCH/SORT/FILTER  ---------------------------------------------------

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
                        }
                    });
                } else {
                    console.log("API FAILED TO GET THE LIST PAIRS");
                }
                break;
            }

            case "library": {
                let payload = {
                    id: "6357194e0a81cb803bbb913e",
                    name: search
                }
                const response = await api.getLibraryMapsByName(payload);

                if (response.data.success) {
                    console.log("success" + response);
                    //let userMaps = response.data.owner;
                    //let collabMaps = response.data.collaborator;
                    console.log(response.data)
                    storeReducer({
                        type: GlobalStoreActionType.SET_SEARCH_NAME,
                        payload: {
                            publicProjects: store.publicProjects,
                            newSearch: search,

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


    store.changeExploreSort = async function (projSortOpt, projSortDir) {

        console.log(projSortOpt)
        console.log(projSortDir)

        let sortOpt;
        if (projSortOpt.toLowerCase().includes('name')) sortOpt = 'name';
        if (projSortOpt.toLowerCase().includes('download')) sortOpt = 'downloads';
        if (projSortOpt.toLowerCase().includes('like')) sortOpt = 'likes';
        if (projSortOpt.toLowerCase().includes('date')) sortOpt = 'date';

        let pagination = { ...store.pagination, page: 0, sort: sortOpt, order: projSortDir === "up" ? 1 : -1 };
        store.changePagination(pagination.page, pagination.limit, pagination.sort, pagination.order);
        storeReducer({
            type: GlobalStoreActionType.SET_EXPLORE_SORT,
            payload: {
                projSortOpt: projSortOpt,
                projSortDir: projSortDir
            }
        });
    }


    store.changeLibrarySort = async function (projSortOpt, projSortDir) {

        let sortOpt;
        if (projSortOpt.toLowerCase().includes('name')) sortOpt = 'name';
        if (projSortOpt.toLowerCase().includes('download')) sortOpt = 'downloads';
        if (projSortOpt.toLowerCase().includes('like')) sortOpt = 'likes';
        if (projSortOpt.toLowerCase().includes('date')) sortOpt = 'date';

        const response = await api.getAllUserProjects({ userId: auth.user._id, sort: sortOpt, order: projSortDir === "up" ? 1 : -1 });
        storeReducer({
            type: GlobalStoreActionType.SET_LIBRARY_SORT,
            payload: {
                userProjects: response.data.projects,
                projSortOpt: projSortOpt,
                projSortDir: projSortDir
            }
        });
    }



















    // -----------------------------------------    PAGINATION   ---------------------------------------------------

    store.changePagination = async function (page, limit, sort, order) {
        sort = sort ? sort : store.pagination.sort;
        order = order ? order : store.pagination.order;

        const response = await api.getAllPublicProjects({ page: page + 1, limit: limit, sort: sort, order: order });
        const nextResponse = await api.getAllPublicProjects({ page: page + 2, limit: limit, sort: sort, order: order });
        let paginate = { page: page + 1, limit: limit, stopPagination: false, sort: sort, order: order };
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
    }


















    // -----------------------------------------    SET CURRENT   ---------------------------------------------------


    store.setCurrentProject = async function (mapId) {
        const response = await api.getMapById(mapId)

        if (response.status === 200) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_PROJECT,
                payload: {
                    currentProject: response.data.map
                }
            })
        }
    }

    store.setCurrentTileset = async function (tilesetId) {
        const response = await api.getTilesetById(tilesetId)

        if (response.status === 200) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_PROJECT,
                payload: {
                    currentProject: response.data.tileset
                }
            })
        }
    }

    store.setCurrentMapTiles = async function (currentMapTiles) {

        // call backend function to update the map as well
        let payload = {
            tiles: currentMapTiles
        }

        let query = {
            id: store.currentProject._id,
            ownerId: store.currentProject.ownerId,
        }

        console.log("STORE SETTING");
        console.log(payload);
        
        const response = await api.updateMap(query, payload)

        let map;
        if (response.status === 200) {
            map = response.data.map
        }


        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_MAP_TILES,
            payload: {
                currentMapTiles: currentMapTiles,
                currentProject: map
            }
        })
    }



    store.setCurrentTile = async function (tileId) {
        const response = await api.getTileById(tileId)

        if (response.status === 200) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_TILE,
                payload: {
                    currentTile: response.data.tile
                }
            })
        }
    }






    // -----------------------------------------    MAPS   ---------------------------------------------------
    store.loadMap = async function (id, getPreview) {

        // set store 
        // currentPage, currentProject, primaryTile, secondaryTile, tilesetTool, 
        // mapTilesets (pallete section), mapTiles [images]
        // currentMapTiles is just going to be map.tiles now (what the map look likes), userFavs, 

        const response = await api.getMapById(id)

        let map;
        if (response.status === 200) {
            map = response.data.map;
            
            let primaryTile = -1
            let secondaryTile = -1
            if (map.tilesets.length !== 0) {
                let tilesetId = map.tilesets[0]
                const response = await api.getTilesetById(tilesetId)
                let tileset = response.data.tileset

                if (tileset.tiles.length !== 0) {
                    primaryTile = 0
                }

                if (tileset.tiles.length > 1) {
                    secondaryTile = 1
                }

            }

            
            const response2 = await api.getMapTilesets(id)

            let mapTilesets; // list of all tileset objects in incorrect order
            let mapTiles; // list of all tiles in incorrect order (from all tilesets)
            
            if (response2.status === 200) {
                mapTilesets = response2.data.tilesets;
                mapTiles = response2.data.tiles;
            }

            let mapTilesetsOrdered = []
            let mapTilesOrdered = []
            let sorting = map.tilesets

            sorting.forEach(function(id) {
                var found = false;
                mapTilesets = mapTilesets.filter(function(tileset) {
                    if(!found && tileset._id == id) {
                        mapTilesetsOrdered.push(tileset);
                        found = true;
                        return false;
                    } else 
                        return true;
                })
            })


            sorting.forEach(function(id) {
                mapTiles = mapTiles.filter(function(tile) {
                    if(tile.tilesetId == id) {
                        mapTilesOrdered.push(tile);
                        return false;
                    } else 
                        return true;
                })
            })






            let numTiles = map.mapHeight * map.mapWidth
            let currentMapTiles = map.tiles.length > 0 ? map.tiles : Array(numTiles).fill(-1)

            if (getPreview) {
                return {
                    currentPage: 'mapEditor',
                    currentProject: map,
                    mapTilesets: mapTilesetsOrdered,
                    mapTiles: mapTilesOrdered,
                    width: map.mapWidth,
                    height: map.mapHeight,
                    currentMapTiles: currentMapTiles,
                }
            }
            storeReducer({
                type: GlobalStoreActionType.LOAD_MAP,
                payload: {
                    currentPage: 'mapEditor',
                    currentProject: map,
                    primaryTile: primaryTile,
                    secondaryTile: secondaryTile,
                    tilesetTool: 'brush',
                    mapTilesets: mapTilesetsOrdered,
                    mapTiles: mapTilesOrdered,
                    currentMapTiles: currentMapTiles,
                }
            })

        } else {
            console.log("LOADING MAP FAILED")
        }



    }


    // -----------------------------------------    MAP VIEWPORT   ------------------------------------------------

    store.initializeViewportOfMap = async function (id, data) {
        let query = {
            mapId: id,
        }

        if (data) {
            query = {
                mapId: id,
                ...data
            }
        }

        console.log(data)
        const response = await api.getMapViewport(query)

        if (response.status < 400) {
            console.log(response)
            return {
                tiles: response.data.tiles,
                width: response.data.width,
                height: response.data.height,
                tilesets: response.data.tilesets,
                start: response.data.start,
                trueIndices: response.data.tilesetData,
                map: response.data._doc
            }
        }
    }

    store.updateMapToViewport = async function (mapId, viewport) {
        let query = {
            mapId: mapId,
            viewport: viewport,
        }

        const response = await api.updateMapToViewport(query)
        console.log("in update viewport", viewport)
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_MAP_TILES,
            payload: {
                currentMapTiles: viewport
            }
        })
    }

    store.getMapTiles = async function (mapId) {
        let query = {
            mapId: mapId,
        }

        const response = await api.getMapTiles(query)

        if (response.status < 400) {
            console.log(response)
            return response.data
        }
    }









    // -----------------------------------------    TILESETS   ---------------------------------------------------

    store.loadTileset = async function (id, getPreview) {
        const response = await api.getTilesetById(id)

        if (response.status === 200) {

            // Sets current tile if applicable
            if (response.data.tileset.tiles[0]) {
                const tile_res = await api.getTileById(response.data.tileset.tiles[0])
                let tile;
                if (tile_res.status === 200) {
                    tile = tile_res.data.tile
                }

                if (getPreview) {
                    return {
                        currentPage: 'tilesetEditor',
                        currentProject: response.data.tileset,
                        currentTile: tile
                    }
                }
                storeReducer({
                    type: GlobalStoreActionType.LOAD_TILESET,
                    payload: {
                        currentProject: response.data.tileset,
                        currentTile: tile
                    }
                })
            }
            // If no tiles, creates new one and sets new tileset and current tile
            else {
                await store.addTileToTilesetById(id)
            }
        }
        else {
            console.log("LOADING TILESET FAILED")
        }
    }


    store.updateTilesetProperties = async function (payload) {
        let query = {
            id: store.currentProject._id,
            ownerId: store.currentProject.ownerId,
        }
        const response = await api.updateTileset(query, payload)
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_PROJECT,
            payload: {
                currentProject: response.data.tileset
            }
        })
    }

    store.updateMapProperties = async function (payload) {
        let query = {
            id: store.currentProject._id,
            ownerId: store.currentProject.ownerId,
        }
        const response = await api.updateMap(query, payload)
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_PROJECT,
            payload: {
                currentProject: response.data.map
            }
        })
    }


    store.setTilesetTool = async function (newTilesetTool) {
        storeReducer({
            type: GlobalStoreActionType.SET_TILESET_TOOL,
            payload: {
                newTilesetTool: newTilesetTool
            }
        })
    }

    store.deleteTilesetFromMap = async function (deletedId) {
        let payload = {
            tilesetId: deletedId,
            mapId: store.currentProject._id
        }

        let lastIndex = 0
        let tilesetLength = 0

        for(let i = 0; i < store.mapTilesets.length; i++) {
            let tileset = store.mapTilesets[i]
            lastIndex += tileset.tiles.length
            if (tileset._id === deletedId) {
                tilesetLength = tileset.tiles.length
                break
            }
        }

        lastIndex = lastIndex - 1

        const response = await api.deleteMapTileset(payload);
        await store.deleteTileset(deletedId);
        
        if (response.status < 400) {

            const response2 = await api.getMapTilesets(response.data.map._id)

            let mapTilesets;
            let mapTiles;

            let mapTilesetsOrdered = []
            let mapTilesOrdered = []
            let sorting = response.data.map.tilesets

            if (response2.status === 200) {
                mapTilesets = response2.data.tilesets;
                mapTiles = response2.data.tiles;

                sorting.forEach(function(id) {
                    var found = false;
                    mapTilesets = mapTilesets.filter(function(tileset) {
                        if(!found && tileset._id == id) {
                            mapTilesetsOrdered.push(tileset);
                            found = true;
                            return false;
                        } else 
                            return true;
                    })
                })

                sorting.forEach(function(id) {
                    mapTiles = mapTiles.filter(function(tile) {
                        if(tile.tilesetId == id) {
                            mapTilesOrdered.push(tile);
                            return false;
                        } else 
                            return true;
                    })
                })

                let primaryTile = -1
                let secondaryTile = -1
                let newMapTiles = []

                for (let i = 0; i < store.currentMapTiles.length; i++) {
                    let tileIndex = store.currentMapTiles[i]
                    if (tileIndex > lastIndex) {
                        tileIndex = tileIndex - tilesetLength 
                        console.log(tileIndex + " - " + tilesetLength)
                    }
                    newMapTiles.push(tileIndex)
                }

                let payload = {
                    tiles: newMapTiles
                };

                let query = {
                    id: response.data.map._id,
                    ownerId: auth.user._id
                }
                const updateResponse = await api.updateMap(query, payload);

                storeReducer({
                    type: GlobalStoreActionType.DELETE_TILESET_FROM_MAP,
                    payload: {
                        currentProject: updateResponse.data.map,
                        mapTilesets: mapTilesetsOrdered,
                        mapTiles: mapTilesOrdered,
                        primaryTile: primaryTile,
                        secondaryTile: secondaryTile,
                        currentMapTiles: newMapTiles,
                    }
                })
            }

            // let mapTilesets = await store.getMapTilesets(store.currentProject._id)

            // let mapTiles = [];
            // let tileIds = [];

            // for (let i = 0; i < mapTilesets.length; i++) {
            //     tileIds = tileIds.concat(mapTilesets[i].tiles)
            // }

            // await Promise.all(tileIds.map(async (tileId) => {
            //     let tile = await store.getTileById(tileId)
            //     mapTiles.push(tile)
            // }));


        }
    }












    // -----------------------------------------   ADD/DELETE TILES TO TILESET ---------------------------------------------------

    store.addTileToCurrentTileset = async function () {
        let payload = {
            tilesetId: store.currentProject._id,
            height: store.currentProject.tileHeight,
            width: store.currentProject.tileWidth,
            tileData: Array(store.currentProject.tileHeight * store.currentProject.tileWidth).fill(''),
        }
        const response = await api.createTile(payload)
        if (response.status === 200) {
            storeReducer({
                type: GlobalStoreActionType.ADD_TILE_TO_CURRENT_TILESET,
                payload: {
                    tileset: response.data.tileset,
                    tile: response.data.tile
                }
            })
        }
    }

    store.addTileToTilesetById = async function (id) {
        let tileset = (await api.getTilesetById(id)).data.tileset

        let payload = {
            tilesetId: tileset._id,
            height: tileset.tileHeight,
            width: tileset.tileWidth,
            tileData: Array(tileset.tileHeight * tileset.tileWidth).fill(''),
        }
        const response = await api.createTile(payload)

        if (response.status === 200) {
            storeReducer({
                type: GlobalStoreActionType.ADD_TILE_TO_CURRENT_TILESET,
                payload: {
                    tileset: response.data.tileset,
                    tile: response.data.tile
                }
            })
        }
    }

    store.createTile = async function (tilesetId, height, width, tileData, tileImage) {
        
        
        console.log("creating new tile")
        let payload = {
            tilesetId: tilesetId,
            height: height,
            width: width,
            tileData: tileData,
            tileImage: tileImage
        }
        const response = await api.createTile(payload)
        console.log(response)
    }















    // -----------------------------------------    TILES   ---------------------------------------------------

    store.updateTile = async function (tileId, tilesetId, tileData, tileImage) {
        const tilesetResponse = await api.getTilesetById(tilesetId)
        let payload = {
            tileId: tileId,
            userId: tilesetResponse.data.tileset.ownerId,
            tileData: tileData,
            tileImage: tileImage
        }
        const response = await api.updateTile(payload)

        //save as image

        if (response.status === 200) {
            storeReducer({
                type: GlobalStoreActionType.UPDATE_TILE,
                payload: {
                    tile: response.data.tile
                }
            })
        }
    }

    store.setPrimaryTile = async function (newPrimaryTile) {
        console.log("Setting primary color to " + newPrimaryTile)
        storeReducer({
            type: GlobalStoreActionType.SET_PRIMARY_TILE,
            payload: {
                newPrimaryTile: newPrimaryTile
            }
        });
        console.log(store.primaryTile)
    }

    store.setSecondaryTile = async function (newSecondaryTile) {
        storeReducer({
            type: GlobalStoreActionType.SET_SECONDARY_TILE,
            payload: {
                newSecondaryTile: newSecondaryTile
            }
        });
    }

    store.swapTiles = async function () {
        let primary = store.primaryTile
        let secondary = store.secondaryTile
        console.log("SWAP TILES")
        storeReducer({
            type: GlobalStoreActionType.SWAP_TILES,
            payload: {
                newPrimary: secondary,
                newSecondary: primary
            }
        })
    }

    store.deleteTileById = async function (id, userId) {
        console.log("Deleting tile (store)")
        let payload = {
            tileId: id,
            userId: userId
        }

        let response = await api.deleteTileById(payload)

        console.log("delete tileset response")
        console.log(response)
        let tilesetId = response.data.tileset_id
        let getTilesetResponse = await api.getTilesetById(tilesetId)
        let newCurrentProject = getTilesetResponse.data.tileset
        console.log("Updated current project after deleting tile from tileset...")
        console.log(newCurrentProject)

        let newCurrentTile;

        if (newCurrentProject.tiles.length > 0) {
            let tileId = newCurrentProject.tiles[0]
            newCurrentTile = (await api.getTileById(tileId)).data.tile
        }
        else {
            newCurrentTile = null
        }
    
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_PROJECT_AND_TILE,
            payload: {
                currentProject: newCurrentProject,
                currentTile: newCurrentTile
            }
        })
        // storeReducer({
        //     type: GlobalStoreActionType.SET_CURRENT_TILE,
        //     payload: {
        //         currentTile: newCurrentTile
        //     }
        // })
    }

    store.getTileById = async function (id) {
        const response = await api.getTileById(id)

        if (response.status === 200) {
            return response.data.tile
        }
    }








    // -----------------------------------------    COLORS   ---------------------------------------------------


    store.setPrimaryColor = async function (newPrimaryColor) {
        console.log("Setting primary color to " + newPrimaryColor)
        storeReducer({
            type: GlobalStoreActionType.SET_PRIMARY_COLOR,
            payload: {
                newPrimaryColor: newPrimaryColor
            }
        });
    }

    store.setSecondaryColor = async function (newSecondaryColor) {
        storeReducer({
            type: GlobalStoreActionType.SET_SECONDARY_COLOR,
            payload: {
                newSecondaryColor: newSecondaryColor
            }
        });
    }

    store.swapColors = async function () {
        let primary = store.primaryColor.slice()
        let secondary = store.secondaryColor.slice()
        storeReducer({
            type: GlobalStoreActionType.SWAP_COLORS,
            payload: {
                newPrimary: secondary,
                newSecondary: primary
            }
        })
    }
















    // -----------------------------------------    COMMENTS  ---------------------------------------------------


    store.loadPublicProjectComments = async function () {
        const response = await api.getAllProjectComments();
        if (response.data.success) {
            let projectComments = response.data.comments;
            storeReducer({
                type: GlobalStoreActionType.LOAD_PROJECT_COMMENTS,
                payload: projectComments
            });
            return projectComments
        } else {
            console.log("API FAILED TO GET THE PROJECT COMMENTS");
        }
    }

    store.getProjectComments = async function (id) {
        const response = await api.getProjectComments(id);
        if (response.data.success) {
            let projectComments = response.data.comments;
            return projectComments
        } else {
            console.log("API FAILED TO GET THE PROJECT COMMENTS");
        }
    }

    store.createNewComment = async function (projectId, ownerId, text) {
        console.log("handling create comment in store...")
        let payload = {
            projectId: projectId,
            userId: ownerId,
            text: text
        };
        let response = await api.createNewComment(payload)
        console.log(response)

        //let response1 = await api.getAllProjectComments();

        let response1 = await api.getProjectComments(projectId);
        if (response1.data.success) {
            let projectComments = response1.data.comments;
            return projectComments
            // storeReducer({
            //     type: GlobalStoreActionType.LOAD_PROJECT_COMMENTS,
            //     payload: projectComments
            // });
        } else {
            console.log("API FAILED TO GET THE PROJECT COMMENTS");
        }
    }

    store.deleteComment = async function (commentId, projectId) {
        let payload = {
            commentId: commentId,
        };
        let response = await api.deleteComment(payload)
        console.log(response)

        //let response1 = await api.getAllProjectComments();

        let response1 = await api.getProjectComments(projectId);
        if (response1.data.success) {
            let projectComments = response1.data.comments;
            return projectComments
        } else {
            console.log("API FAILED TO DELETE THE PROJECT COMMENTS");
        }
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
                    setLikeDislikeCallback(comment.likes, comment.dislikes, response.data.comment);
                    //store.loadPublicProjectComments();
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
                    setLikeDislikeCallback(comment.likes, comment.dislikes, response.data.comment);
                    //store.loadPublicProjectComments();
                }
            }
            updatingComment(comment)
        });
    }













    // -----------------------------------------    RESET  ---------------------------------------------------

    store.reset = function () {
        storeReducer({
            type: GlobalStoreActionType.CLEAR_STORE,
            payload: null
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
const Map = require('../models/map-model')
const User = require('../models/user-model')
const Tileset = require('../models/tileset-model')
const Tile = require('../models/tile-model')
const ProjectComment = require('../models/project-comment-model')
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require('mongoose')

createMap = async (req, res) => {

    // Checks if the request contains any data
    // If not, return an error message
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No body was provided by the client."
        })
    }

    try {

        // Get data from request
        let { title, mapDescription, tags, mapBackgroundColor, mapHeight, mapWidth, tileHeight, tileWidth, ownerId } = req.body;

        if (!mapHeight || !mapWidth || !ownerId) {
            return res
                .status(400)
                .json({
                    message: "Please enter all required fields."
                });
        }

        let ownerObjectId = mongoose.Types.ObjectId(ownerId)

        // Checks if another one of the user's maps already has the given name
        // If so, map is not created
        const existingMap = await Map.findOne({
            ownerId: ownerObjectId,
            title: title
        });
        if (existingMap) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Another Map owned by the same User already has this name"
                })
        }

        // Checks if the dimensions are negative or not
        // If negative, map is not created
        if (mapHeight <= 0) {
            return res
                .status(400)
                .json({
                    message: "Map can not have a height of zero or less pixels."
                });
        }
        if (mapWidth <= 0) {
            return res
                .status(400)
                .json({
                    message: "Map can not have a width of zero or less pixels."
                });
        }
        if (tileHeight <= 0) {
            return res
                .status(400)
                .json({
                    message: "Map can not have a height of zero or less tiles."
                });
        }
        if (tileWidth <= 0) {
            return res
                .status(400)
                .json({
                    message: "Map can not have a width of zero or less tiles."
                });
        }

        // If name is not specified, "Untitled" is given as default
        // If "Untitled" is already taken, "Untitled1" is given instead and so on
        if (title == "") {

            title = "Untitled"
            let untitled_num = 1

            const existingUntitledMap = await Map.findOne({
                ownerId: ownerObjectId,
                title: title
            });

            while (existingUntitledMap) {
                title = "Untitled" + untitled_num

                const existingUntitledMap = await Map.findOne({
                    ownerId: ownerObjectId,
                    title: title
                });

                untitled_num++
            }

        }

        // If description is not specified, "No description" is given as default
        if (mapDescription == "") {
            mapDescription = "No description."
        }

        // Creates Map
        let map = null
        let collaboratorIds = []
        let tiles = []
        let tilesets = []
        let isPublic = false

        for (let i = 0; i < mapWidth * mapHeight; i++) {
            tiles.push(-1);
        }

        map = new Map({

            title: title,
            mapDescription: mapDescription,
            mapBackgroundColor: mapBackgroundColor,
            mapHeight: mapHeight,
            mapWidth: mapWidth,
            tileHeight: tileHeight,
            tileWidth: tileWidth,
            tiles: tiles,
            tilesets: tilesets,
            ownerId: ownerObjectId,
            collaboratorIds: collaboratorIds,
            isPublic: isPublic,
            likes: [],
            dislikes: [],
            favs: [],
            downloads: 0,
            comments: [],

        })

        if (!map) {
            return res
                .status(400)
                .json({
                    message: "Ran into an error when creating Map"
                });
        }

        console.log(map)
        // Saves map
        map
            .save()
            .then(() => {
                return res.status(201).json({
                    success: true,
                    map: map,
                    id: map._id,
                    message: 'Map was successfully created.'
                })
            })
            .catch(error => {
                return res.status(400).json({
                    error,
                    message: 'Map was not created.'
                })
            })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send()
    }

}

deleteMap = async (req, res) => {

    let id = mongoose.Types.ObjectId(req.body.id)
    let ownerObjectId = mongoose.Types.ObjectId(req.body.ownerId)

    Map.findOne({ _id: id }, (err, map) => {

        // Checks if Map with given id exists
        if (err) {
            return res.status(404).json({
                err,
                message: 'Map not found',
            })
        }

        if (!map) {
            return res.status(404).json({
                message: 'Map not found'
            })
        }

        // Checks if Map belongs to the User who is trying to delete it
        if (!map.ownerId.equals(ownerObjectId)) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this Map',
            })
        }

        // Deletes Map comments
        const comments = ProjectComment.deleteMany({ projectId: id })
        comments.then((deleted) => {
            if (!deleted) {
                return res.status(400).json({
                    err,
                    message: 'Comments were not deleted',
                })
            }
            // Finds Map with given id and deletes it
            Map.findByIdAndDelete(id, (err, map) => {
                return res.status(200).json({
                    success: true,
                    data: map
                })
            }).catch(err => console.log(err))
        })
    })

}

updateMap = async (req, res) => {

    let id = mongoose.Types.ObjectId(req.query.id)
    let ownerObjectId = mongoose.Types.ObjectId(req.query.ownerId)

    // Checks if request contains any body data
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No body was given by the client",
        })
    }

    Map.findOne({ _id: id }, async (err, map) => {

        // Checks if Map exists
        if (err) {
            return res.status(404).json({
                err,
                message: "Map not found"
            })
        }

        if (!map) {
            console.log('otherwise here')
            return res.status(404).json({
                message: 'Map not found'
            })
        }

        // Checks if Map belongs to the User who is trying to delete it
        // if (!map.ownerId.equals(ownerObjectId) && !map.collaboratorIds.includes(ownerObjectId)) {
        //     return res.status(401).json({
        //         err,
        //         message: 'User does not have ownership of this Map',
        //     })
        // }

        // Changes all the present fields
        const { _id, title, mapDescription, tags, mapBackgroundColor, mapHeight, mapWidth, tileHeight,
            tileWidth, tiles, tilesets, ownerId, collaboratorIds, isPublic, likes, dislikes, favs,
            downloads, comments} = req.body;

        if (title) {
            if (title == "") {

                title = "Untitled"
                let untitled_num = 1

                const existingUntitledMap = await Map.findOne({
                    _id: _id,
                    title: title
                });

                while (existingUntitledMap) {
                    title = "Untitled" + untitled_num
                    untitled_num++
                }

            }
            map.title = title
        }
        if (mapDescription) {
            if (mapDescription == "") {
                mapDescription = "No description"
            }
            map.mapDescription = mapDescription
        }
        if (tags)
            map.tags = tags
        if (mapBackgroundColor)
            map.mapBackgroundColor = mapBackgroundColor
        if (mapHeight)
            map.mapHeight = mapHeight
        if (mapWidth)
            map.mapWidth = mapWidth
        if (tileHeight)
            map.tileHeight = tileHeight
        if (tileWidth)
            map.tileWidth = tileWidth
        if (tiles)
            map.tiles = tiles
        if (tilesets)
            map.tilesets = tilesets
        if (collaboratorIds)
            map.collaboratorIds = collaboratorIds
        if (isPublic)
            map.isPublic = isPublic
        if (likes)
            map.likes = likes
        if (dislikes)
            map.dislikes = dislikes
        if (favs)
            map.favs = favs
        if (downloads)
            map.downloads = downloads
        if (comments)
            map.comments = comments

        // Attempts to save updated map
        map
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: map._id,
                    map: map,
                    message: 'Map was successfully updated',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Map was not updated',
                })
            })


        //
    })

}

publishMap = async (req, res) => {
    console.log('in backend publish')
    console.log(req.query)
    console.log(req.body)

    let id = mongoose.Types.ObjectId(req.query.id)
    let ownerObjectId = mongoose.Types.ObjectId(req.query.ownerId)

    // Checks if request contains any body data
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No body was given by the client",
        })
    }

    Map.findOne({ _id: id }, async (err, map) => {

        // Checks if Map exists
        if (err) {
            return res.status(404).json({
                err,
                message: "Map not found"
            })
        }

        if (!map) {
            return res.status(404).json({
                message: 'Map not found'
            })
        }

        // Checks if Map belongs to the User who is trying to delete it
        if (!map.ownerId.equals(ownerObjectId)) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this Map',
            })
        }

        // Change public
        map.isPublic = req.body.isPublic

        // Attempts to save updated map
        map
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    map: map,
                    message: 'Map was successfully updated',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Map was not updated',
                })
            })

    })

}

getAllUserMaps = async (req, res) => {

    console.log("GETTING ALL USER MAPS...")
    const { ownerId } = req.params;
    await Map.find({ ownerId: ownerId }, (err, maps) => {

        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        if (!maps) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: "Maps could not be found"
                })
        }
        else {
            // Alls all User's Maps to array of data
            let mapsData = [];
            for (key in maps) {

                let map = maps[key]
                let mapData = {

                    _id: map._id,
                    title: map.title,
                    mapDescription: map.mapDescription,
                    mapBackgroundColor: map.mapBackgroundColor,
                    mapHeight: map.mapHeight,
                    mapWidth: map.mapWidth,
                    tileHeight: map.tileHeight,
                    tileWidth: map.tileWidth,
                    tiles: map.tiles,
                    tilesets: map.tilesets,
                    ownerId: map.ownerId,
                    collaboratorIds: map.collaboratorIds,
                    isPublic: map.isPublic,
                    likes: map.likes,
                    dislikes: map.dislikes,
                    favs: map.favs,
                    downloads: map.downloads,
                    comments: map.comments,
                    creationDate: map.creationDate

                }

                mapsData.push(mapData)

            }
            console.log(mapsData)
            return res.status(200).json({
                success: true,
                maps: mapsData
            })
        }
    }).catch(err => console.log(err));

}

getAllUserAsCollaboratorMaps = async (req, res) => {

    let { id } = req.params;
    // id = mongoose.Types.ObjectId(id)
    await Map.find({}, (err, maps) => {

        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        if (!maps) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: "Maps could not be found"
                })
        }
        else {
            // Alls all User's Maps to array of data
            let mapsData = [];
            for (key in maps) {

                let map = maps[key]
                let mapData = null

                if (map.collaboratorIds.includes(id)) {
                    mapData = {
                        _id: map._id,
                        title: map.title,
                        mapDescription: map.mapDescription,
                        mapBackgroundColor: map.mapBackgroundColor,
                        mapHeight: map.mapHeight,
                        mapWidth: map.mapWidth,
                        tileHeight: map.tileHeight,
                        tileWidth: map.tileWidth,
                        tiles: map.tiles,
                        tilesets: map.tilesets,
                        ownerId: map.ownerId,
                        collaboratorIds: map.collaboratorIds,
                        isPublic: map.isPublic,
                        likes: map.likes,
                        dislikes: map.dislikes,
                        favs: map.favs,
                        downloads: map.downloads,
                        comments: map.comments,
                        creationDate: map.creationDate
                    }
                    mapsData.push(mapData)
                }

            }

            return res.status(200).json({
                success: true,
                maps: mapsData
            })
        }
    }).catch(err => console.log(err));

}

getMapsByName = async (req, res) => {

    const { title } = req.query;
    await Map.find({}, (err, maps) => {

        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        if (!maps) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: "Maps could not be found"
                })
        }
        else {
            //Generates list of Maps to return
            let mapsData = [];
            for (key in maps) {

                let map = maps[key]

                //Checks if Map matches or begins with the wanted name/search
                if (map.title.toLowerCase().startsWith(title.toLowerCase()) && title) {

                    let mapData = {

                        _id: map._id,
                        title: map.title,
                        mapDescription: map.mapDescription,
                        mapBackgroundColor: map.mapBackgroundColor,
                        mapHeight: map.mapHeight,
                        mapWidth: map.mapWidth,
                        tileHeight: map.tileHeight,
                        tileWidth: map.tileWidth,
                        tiles: map.tiles,
                        tilesets: map.tilesets,
                        ownerId: map.ownerId,
                        collaboratorIds: map.collaboratorIds,
                        isPublic: map.isPublic,
                        likes: map.likes,
                        dislikes: map.dislikes,
                        favs: map.favs,
                        downloads: map.downloads,
                        comments: map.comments,
                        creationDate: creationDate

                    }

                    mapsData.push(mapData)

                }
            }
            return res.status(200).json({
                success: true,
                maps: mapsData
            })
        }
    }).catch(err => console.log(err));

    // console.log("RANDOM CONSOLE LOG")
}

getMapbyId = async (req, res) => {
    const savedMap = await Map.findById(req.params.id);
    return res.status(200).json({
        map: savedMap
    });
}


getAllPublicMapsOnPage = async (req, res) => {
    var { page } = req.query;
    var { limit } = req.body;

    if (!page) {
        page = 0;
    }

    if (!limit) {
        limit = 10;
    }

    if (Number.isNaN(+page) || Number.isNaN(+limit)) {
        return res.status(400).json({
            success: false,
            message: "Page and limit must be numbers"
        })
    }

    page = +page;
    limit = +limit;

    if (page < 1) {
        return res.status(400).json({
            success: false,
            message: "Page must be greater than 0"
        })
    }

    if (limit < 1) {
        return res.status(400).json({
            success: false,
            message: "Limit must be greater than 0"
        })
    }

    const startIndex = page > 0 ? (page - 1) * limit : 0;
    limit = Number(limit);
    const rangeMap = await Map.aggregate([
        { $match: { isPublic: true } },
        { $skip: startIndex },
        { $limit: limit },
        { $sort: { ratio: -1 } }
    ])
    // return res.status(200).json({
    //     success: true,
    //     count: rangeMap.length,
    //     maps: rangeMap
    // }).send();
}

getAllPublicProjects = async (req, res) => {

    var { page } = req.query;
    var { limit } = req.query;
    var { sort } = req.query;
    var { order } = req.query;

    if (!page) {
        page = 0;
    }

    // console.log(order)
    order = order === 'asc' || +order === 1 ? 1 : -1;
    if (!sort || sort === 'date') {
        sort = { createdAt: order };
    } else if (sort === "likes") {
        sort = { "numLikes": order };
    } else if (sort === "name") {
        sort = { title: order };
    } else if (sort === "downloads") {
        sort = { downloads: order };
    } else {
        sort = { createdAt: order };
    }

    if (limit && !Number.isNaN(+limit)) {
        limit = +limit;
    }

    if (Number.isNaN(+page)) {
        return res.status(400).json({
            success: false,
            message: "Page and limit must be numbers"
        })
    }

    page = +page;

    if (page < 0) {
        return res.status(400).json({
            success: false,
            message: "Page must be greater than 0"
        })
    }

    var startIndex;
    var rangeProject;
    // console.log("sorting by: ", sort)
    if (limit) {
        startIndex = (page - 1) * limit;
        rangeProject = await Map.aggregate([
            { $match: { isPublic: true } },
            { $unionWith: { coll: "tilesets", pipeline: [ { $match: { isPublic: true } } ] } },
            { $addFields: { numLikes: { $size: "$likes"} } },
            { $sort: sort },
            { $skip: startIndex },
            { $limit: limit },
        ]);
    } else {
        startIndex = page - 1;
        rangeProject = await Map.aggregate([
            { $match: { isPublic: true } },
            { $unionWith: { coll: "tilesets", pipeline: [ { $match: { isPublic: true } } ] } },
            { $addFields: { numLikes: { $size: "$likes"} } },
            { $sort: sort },
            { $skip: startIndex },
        ]);
    }

    return res.status(200).json({
        success: true,
        count: rangeProject.length,
        projects: rangeProject
    });
}

var getAllProjectsWithUser = async (req, res) => {
        var { page } = req.query;
        var { limit } = req.query;
        var { sort } = req.query;
        var { order } = req.query;
        var { userId } = req.query;

        console.log(req.query)
        if (!page) {
            page = 0;
        }

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "User ID is invalid"
            })
        }

        userId = mongoose.Types.ObjectId(userId);

        // console.log(order)
        order = order === 'asc' || +order === 1 ? 1 : -1;
        if (!sort || sort === 'date') {
            sort = { createdAt: order };
        } else if (sort === "likes") {
            sort = { "numLikes": order };
        } else if (sort === "name") {
            sort = { title: order };
        } else if (sort === "downloads") {
            sort = { downloads: order };
        } else {
            sort = { createdAt: order };
        }
    
        if (limit && !Number.isNaN(+limit)) {
            limit = +limit;
        }
    
        if (Number.isNaN(+page)) {
            return res.status(400).json({
                success: false,
                message: "Page and limit must be numbers"
            })
        }
    
        page = +page;
    
        if (page < 0) {
            return res.status(400).json({
                success: false,
                message: "Page must be greater than 0"
            })
        }
    
        var startIndex;
        var rangeProject;
        // console.log("sorting by: ", sort)
        if (limit) {
            startIndex = (page - 1) * limit;
            rangeProject = await Map.aggregate([
                { $match: { $or: [ { ownerId: userId }, { collaboratorIds: { $in: [userId] } } ] } },
                { $unionWith: { coll: "tilesets", pipeline: [ { $match: { $and: [{isLocked: false}, { $or: [ { ownerId: userId }, { collaboratorIds: { $in: [userId] } } ] }] } } ] } },
                { $addFields: { numLikes: { $size: "$likes"} } },
                { $sort: sort },
                { $skip: startIndex },
                { $limit: limit },
            ]);
        } else {
            startIndex = page - 1;
            rangeProject = await Map.aggregate([
                { $match: { $or: [ { ownerId: userId }, { collaboratorIds: { $in: [userId] } } ] } },
                { $unionWith: { coll: "tilesets", pipeline: [ { $match: { $and: [{isLocked: false}, { $or: [ { ownerId: userId }, { collaboratorIds: { $in: [userId] } } ] }] } } ] } },
                { $addFields: { numLikes: { $size: "$likes"} } },
                { $sort: sort },
                { $skip: startIndex },
            ]);
        }

        return res.status(200).json({
            success: true,
            count: rangeProject.length,
            projects: rangeProject
        });
}

getPublicProjectsByName = async (req, res) => {
    console.log('req.params')
    console.log(req.params)

    var name = req.params.name
    var { page } = req.query;
    var { limit } = req.body;

    if (!page) {
        page = 0;
    }

    if (!limit) {
        limit = 10;
    }

    if (Number.isNaN(+page) || Number.isNaN(+limit)) {
        return res.status(400).json({
            success: false,
            message: "Page and limit must be numbers"
        })
    }

    page = +page;
    limit = +limit;

    if (page < 0) {
        return res.status(400).json({
            success: false,
            message: "Page must be greater than 0"
        })
    }

    if (limit < 1) {
        return res.status(400).json({
            success: false,
            message: "Limit must be greater than 0"
        })
    }

    const startIndex = page > 0 ? (page - 1) * limit : 0;
    limit = Number(limit);
    const rangeProject = await Map.aggregate([
        { $match: { isPublic: true, title: { $regex: name, $options: "i"} }},
        { $unionWith: { coll: 'tilesets', pipeline: [
            { $match: {
                isPublic: true,
                title: {
                    $regex: name,
                    $options: "i"
                }
            }}
        ] }},
        { $sort: { createdAt: -1 } },
        { $skip: startIndex },
        { $limit: limit },
    ]);



    console.log("please god")
    console.log(rangeProject)

    return res.status(200).json({
        success: true,
        count: rangeProject.length,
        projects: rangeProject
    });
}

addUserToMap = async (req, res) => {

    const { mapId, requesterId } = req.body;

    if (!mapId) {
        return res.status(400).json({
            success: false,
            error: "Map ID is required"
        })
    }

    if (!requesterId) {
        return res.status(400).json({
            success: false,
            error: "Requester ID is required"
        })
    }

    var mid;
    var uid;

    try {
        mid = mongoose.Types.ObjectId(mapId);
        uid = mongoose.Types.ObjectId(requesterId);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid Map ID or User ID format",
            error: err
        })
    }

    const chosenMap = await Map.findById(mid);
    const chosenUser = await User.findById(uid);

    if (!chosenUser) {
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        })
    }

    if (!chosenMap) {
        return res.status(400).json({
            success: false,
            message: "Map does not exist"
        })
    }

    if (chosenMap.ownerId.equals(uid)) {
        return res.status(400).json({
            success: false,
            message: "You are already the owner of this map"
        })
    }

    if (chosenMap.collaboratorIds.includes(uid)) {
        return res.status(400).json({
            success: false,
            message: "You are already a collaborator of this map"
        })
    }

    chosenMap.collaboratorIds.push(uid);

    chosenMap.save()
        .then((map) => {
            return res.status(200).json({
                success: true,
                message: "User added to map",
                map: map
            })
        })
        .catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Error adding user to map",
                error: err
            })
        })
}



removeUserFromMap = async (req, res) => {

    const { mapId, requesterId } = req.body;

    if (!mapId) {
        return res.status(400).json({
            success: false,
            error: "Map ID is required"
        })
    }

    if (!requesterId) {
        return res.status(400).json({
            success: false,
            error: "Requester ID is required"
        })
    }

    var mid;
    var uid;

    try {
        mid = mongoose.Types.ObjectId(mapId);
        uid = mongoose.Types.ObjectId(requesterId);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid Map ID or User ID format",
            error: err
        })
    }

    const chosenMap = await Map.findById(mid);
    const chosenUser = await User.findById(uid);

    if (!chosenUser) {
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        })
    }

    if (!chosenMap) {
        return res.status(400).json({
            success: false,
            message: "Map does not exist"
        })
    }

    if (chosenMap.ownerId.equals(uid)) {
        return res.status(400).json({
            success: false,
            message: "Cannot remove owner of Map"
        })
    }

    if (!chosenMap.collaboratorIds.includes(uid)) {
        return res.status(400).json({
            success: false,
            message: "Not a collaborator of this map"
        })
    }

    chosenMap.collaboratorIds.remove(requesterId);

    chosenMap.save()
        .then((map) => {
            return res.status(200).json({
                success: true,
                message: "User removed as collaborator to map",
                map: map
            })
        })
        .catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Error removing user from map collaborator",
                error: err
            })
        })
}

var getOwnerAndCollaborator = async (req, res) => {
    var { id } = req.query;
    var { isMap } = req.query;
    console.log("Getting id of " + id);
    console.log('isMap: '+ isMap );
    if (isMap == undefined || isMap == null) {
        isMap = false;
    }

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Id not given'
        })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Id is not valid'
        })
    }

    id = mongoose.Types.ObjectId(id);

    var map;
    console.log("Map is now: " + isMap);
    if (isMap === 'true') {
        console.log("map found");
        map = await Map.findOne({_id:id});
    } else {
        console.log('tileset found');
        map = await Tileset.findOne({_id:id});
    }
    console.log(map);
    console.log(isMap)
    if (!map) {
        return res.status(400).json({
            success: false,
            message: 'Map does not exist'
        })
    }

    const owner = await User.findOne({_id:map.ownerId});
    if (!owner) {
        return res.status(400).json({
            success: false,
            message: 'Owner does not exist'
        })
    }

    const aggregate = await User.aggregate([
        {
            $match: {
                _id: {
                    $in: map.collaboratorIds
                }
            }
        }
    ]);

    return res.status(200).json({
        success: true,
        owner: owner,
        collaborators: aggregate,
        message: 'Successfully got owner and collaborators'
    })
}

var importTilesetToMap = async (req, res) => {
    var { mapId, tilesetId } = req.body;

    if (!tilesetId || !mapId) {
        return res.status(400).json({
            success: false,
            message: "You must provide a tileset id and a map id",
        })
    }

    var mid;
    var tid;
    try {
        mid = mongoose.Types.ObjectId(mapId);
        tid = mongoose.Types.ObjectId(tilesetId);
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid Map ID or Tileset ID format",
            error: err
        })
    }

    const chosenMap = await Map.findById(mid);
    const chosenTileset = await Tileset.findById(tid);
    if (!chosenMap) {
        return res.status(400).json({
            success: false,
            message: "Map does not exist"
        })
    }

    if (!chosenTileset) {
        return res.status(400).json({
            success: false,
            message: "Tileset does not exist"
        })
    }

    if (!chosenMap.tilesets.includes(tid)) {
        chosenMap.tilesets.push(tid);
    }

    console.log(chosenMap.tilesets);
    chosenMap.save()
        .then((map) => {
            return res.status(200).json({
                success: true,
                message: "Tileset added to map",
                map: map
            })
        }).catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Error adding tileset to map",
                error: err
            })
        })
}


getMapTilesets = async (req, res) => {
    console.log('atleast here')
    console.log(req.params.id)
    const savedMap = await Map.findById(req.params.id);

    let tilesetIds = savedMap.tilesets
    const tilesetIdObjs = tilesetIds.map(id => new ObjectId(id));
    console.log(tilesetIds)
    
    var tilesets = await Tileset.find({ "_id": { $in: tilesetIdObjs } });

    var tiles = await Tile.find({ "tilesetId": { $in: tilesetIdObjs } });
    
    
    console.log('these are the tiles')
    // console.log(tiles)
    

    return res.status(200).json({
        success: true,
        tilesets: tilesets,
        tiles: tiles
    });
}

deleteMapTileset = async (req, res) => {
    var { mapId, tilesetId } = req.body;

    if (!tilesetId || !mapId) {
        return res.status(400).json({
            success: false,
            message: "You must provide a tileset id and a map id",
        })
    }

    var mid;
    var tid;
    try {
        mid = mongoose.Types.ObjectId(mapId);
        tid = mongoose.Types.ObjectId(tilesetId);
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: "Invalid Map ID or Tileset ID format",
            error: err
        })
    }

    const chosenMap = await Map.findById(mid);
    const chosenTileset = await Tileset.findById(tid);
    if (!chosenMap) {
        return res.status(400).json({
            success: false,
            message: "Map does not exist"
        })
    }

    if (!chosenTileset) {
        return res.status(400).json({
            success: false,
            message: "Tileset does not exist"
        })
    }

    if (!chosenMap.tilesets.includes(tid)) {
        return res.status(400).json({
            success: false,
            message: "Map does not include Tileset"
        })
    }

    await Map.findOneAndUpdate(
        { '_id': mid },
        { $pull: { tilesets: tilesetId } },
        { returnOriginal: false },
    ).then((newMap) => {
        console.log(newMap)
        return res.status(200).json({
            success: true,
            map: newMap,
            message: 'Tileset has been deleted!'
        })

    }).catch((err) => {
        console.log(err)
        return res.status(404).json({
            success: false,
            message: 'Failed to delete tileset!!!'
        })

    })


}

module.exports = {
    getAllUserMaps,
    getAllUserAsCollaboratorMaps,
    getMapsByName,
    getMapbyId,
    createMap,
    deleteMap,
    updateMap,
    publishMap,
    getAllPublicMapsOnPage,
    addUserToMap,
    getAllPublicProjects,
    getPublicProjectsByName,
    removeUserFromMap,
    getAllProjectsWithUser,
    getOwnerAndCollaborator,
    importTilesetToMap,
    getMapTilesets,
    deleteMapTileset
}
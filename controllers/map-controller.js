const Map = require('../models/map-model')
const ProjectComment = require('../models/project-comment-model')
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
        const { mapName, mapDescription, tags, mapBackgroundColor, mapHeight, mapWidth, tileHeight, tileWidth, ownerId } = req.body;

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
            mapName: mapName
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
        if (mapName == "") {

            mapName = "Untitled"
            let untitled_num = 1

            const existingUntitledMap = await Map.findOne({
                ownerId: ownerObjectId,
                mapName: mapName
            });

            while (existingUntitledMap) {
                mapName = "Untitled" + untitled_num

                const existingUntitledMap = await Map.findOne({
                    ownerId: ownerObjectId,
                    mapName: mapName
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
        let layers = []
        let collaboratorIds = []
        let tiles = []
        let tilesets = []
        let isPublic = false

        map = new Map({

            mapName: mapName,
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
            layers: layers,
            likes: 0,
            dislikes: 0,
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
        res.status(500).send()
    }

}

deleteMap = async (req, res) => {

    let id = mongoose.Types.ObjectId(req.query.id)
    let ownerObjectId = mongoose.Types.ObjectId(req.query.ownerId)

    Map.findById({ _id: id }, (err, map) => {

        // Checks if Map with given id exists
        if (err) {
            return res.status(404).json({
                err,
                message: 'Map not found',
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

    console.log("random console.log")

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

        // Checks if Map belongs to the User who is trying to delete it
        if (!map.ownerId.equals(ownerObjectId)) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this Map',
            })
        }

        // Changes all the present fields
        const { _id, mapName, mapDescription, tags, mapBackgroundColor, mapHeight, mapWidth, tileHeight, tileWidth, tiles, tilesets, ownerId, collaboratorIds, isPublic, layers } = req.body;

        if (mapName) {
            if (mapName == "") {

                mapName = "Untitled"
                let untitled_num = 1

                const existingUntitledMap = await Map.findOne({
                    _id: _id,
                    mapName: mapName
                });

                while (existingUntitledMap) {
                    mapName = "Untitled" + untitled_num
                    untitled_num++
                }

            }
            map.mapName = mapName
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
        if (layers)
            map.layers = layers

        // Attempts to save updated map
        map
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: map._id,
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
                    id: map._id,
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

    const { ownerId } = req.query;
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
                    mapName: map.mapName,
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
                    layers: map.layers

                }

                mapsData.push(mapData)

            }
            return res.status(200).json({
                success: true,
                maps: mapsData
            })
        }
    }).catch(err => console.log(err));

}

getMapsByName = async (req, res) => {

    const { mapName } = req.query;
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
                if (map.mapName.toLowerCase().startsWith(mapName.toLowerCase()) && mapName) {

                    let mapData = {

                        _id: map._id,
                        mapName: map.mapName,
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
                        layers: map.layers

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
    const savedMap = await Map.findById(req.query.id);
    return res.status(200).json({
        map: savedMap
    }).send();
}

var getAllPublicMapsOnPage = async (req, res) => {
    const { page } = req.query;
    var { limit } = req.body;

    if (!page) {
        return res.status(400).json({
            success: false,
            error: "No page was given by the client",
        })
    }

    if (!limit) {
        limit = 10;
    }

    const startIndex = page > 0 ? (page - 1) * limit : 0;
    const rangeMaps = await Map.find({ isPublic: true }).sort({ likes: 1 }).skip(startIndex).limit(limit);
    return res.status(200).json({
        success: true,
        maps: rangeMaps
    }).send();
}

module.exports = {
    getAllUserMaps,
    getMapsByName,
    getMapbyId,
    createMap,
    deleteMap,
    updateMap,
    publishMap,
    getAllPublicMapsOnPage
}
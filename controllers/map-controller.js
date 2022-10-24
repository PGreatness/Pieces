const Map = require('../models/map-model')

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
        const { _id, mapName, mapDescription, tags, mapBackgroundColor, mapHeight, mapWidth, tileHeight, tileWidth, tiles, tilesets, ownerId, collaboratorIds, isPublic, layers } = req.body;

        if (!_id || !mapName || !mapDescription || !tags || !mapBackgroundColor || !mapHeight || !mapWidth || !tileHeight || !tileWidth || !tiles || !tilesets || !ownerId || !collaboratorIds || !isPublic || !layers) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        // Checks if another one of the user's maps already has the given name
        // If so, map is not created
        const existingMap = await Map.findOne({
            _id: _id,
            mapName, mapName
        });
        if (existingMap) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Another Map owned by the same User already has this name"
                })
        }

        // Checks if the dimensions are negative or not
        // If negative, map is not created
        if (mapHeight <= 0) {
            return res
                .status(400)
                .json({
                    errorMessage: "Map can not have a height of zero or less pixels."
                });
        }
        if (mapWidth <= 0) {
            return res
                .status(400)
                .json({
                    errorMessage: "Map can not have a width of zero or less pixels."
                });
        }
        if (tileHeight <= 0) {
            return res
                .status(400)
                .json({
                    errorMessage: "Map can not have a height of zero or less tiles."
                });
        }
        if (tileWidth <= 0) {
            return res
                .status(400)
                .json({
                    errorMessage: "Map can not have a width of zero or less tiles."
                });
        }

        // If name is not specified, "Untitled" is given as default
        // If "Untitled" is already taken, "Untitled1" is given instead and so on
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

        // If description is not specified, "No description" is given as default
        if (mapDescription == "") {
            mapDescription = "No description."
        }

        // Creates Map
        let map = null
        map = new Map({
            _id: _id,
            mapName: mapName,
            mapDescription: mapDescription,
            mapBackgroundColor: mapBackgroundColor,
            mapHeight: mapHeight,
            mapWidth: mapWidth,
            tileHeight: tileHeight,
            tileWidth: tileWidth,
            tiles: tiles,
            tilesets: tilesets,
            ownerId: ownerId,
            collaboratorIds: collaboratorIds,
            isPublic: isPublic,
            layers: layers
        })

        if (!map) {
            return res
                .status(400)
                .json({
                    errorMessage: "Ran into an error when creating Map"
                });
        }

        // Saves map
        map
            .save()
            .then(() => {
                return res.status(201).json({
                    success: true,
                    map: map,
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

    Map.findById({ _id: req.params.id }, (err, map) => {

        // Checks if Map with given id exists
        if (err) {
            return res.status(404).json({
                err,
                message: 'Map not found',
            })
        }

        // Checks if Map belongs to the User who is trying to delete it
        if (map.ownerId != req.params.ownerId) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this Map',
            })
        }

        // Finds Map with given id and deletes it
        Map.findByIdAndDelete(req.params.id, (err, map) => {
            return res.status(200).json({
                success: true,
                data: map
            })
        }).catch(err => console.log(err))

    })

}

updateMap = async (req, res) => {

    // Checks if request contains any body data
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No body was given by the client",
        })
    }

    Map.findOne({ _id: req.params.id }, async (err, map) => {

        // Checks if Map exists
        if (err) {
            return res.status(404).json({
                err,
                message: "Map not found"
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
        if (ownerId)
            map.ownerId = ownerId
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

getUserMapsByName = async (req, res) => {

    const { userName, name } = req.query;
    await Map.find({ userName: userName }, (err, maps) => {

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

                map = maps[key]

                //Checks if Map matches or begins with the wanted name/search
                if (map.name.toLowerCase().startsWith(name.toLowerCase()) && name) {

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

}

getMapbyId = async (req, res) => {
    const savedMap = await Map.findById(req.params.id);
    return res.status(200).json({
        map: savedMap
    }).send();
}
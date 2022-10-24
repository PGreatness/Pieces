const Tileset = require('../models/tileset-model')

createTileset = async (req, res) => {
    try {
        const { tilesetName, imagePixelHeight, imagePixelWidth, tileHeight, tileWidth, source, ownerId, isPublic, isLocked, tiles } = req.body;
        if (!imagePixelHeight || !imagePixelWidth || !tileHeight || !tileWidth || !source || !ownerId || !isPublic || !isLocked || !tiles) {
            return res
                .status(400)
                .json({ errorMessage: "Something went wrong with tileset input." })
        }

        // Checks if another one of the user's tilesets already has the given name,
        // If so, tileset is not created.
        const existingTileset = await Tileset.findOne({
            _id: _id,
            tilesetName: tilesetName
        });
        if (existingTileset) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "Another Tileset owned by the same User already has this name."
                })
        }

        // If name is not specified, "Untitled" is given as default
        // If "Untitled" is already taken, "Untitled1" is given instead and so on
        if (tilesetName == "") {

            tilesetName = "Untitled"
            let untitled_num = 1

            const existingUntitledTileset = await Tileset.findOne({
                _id: _id,
                tilesetName: tilesetName
            });

            while (existingUntitledTileset) {
                tilesetName = "Untitled" + untitled_num
                untitled_num++
            }

        }

        const newTileset = new Tileset({
            tilesetName, imagePixelHeight, imagePixelWidth, tileHeight, tileWidth, source, ownerId, isPublic, isLocked, tiles
        });
            await newTileset.save().then(() => {
                return res.status(200).json({
                    success: true,
                    message: 'A tileset has been created!'
                })
            }).catch((err) => {
                console.log(err)
                return res.status(404).json({
                    success: false,
                    message: 'Failed to create tileset.'
                })
            });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

deleteTileset = async (req, res) => {

    Tileset.findById({ _id: req.params.id }, (err, tileset) => {

        // Checks if Tileset with given id exists
        if (err) {
            return res.status(404).json({
                err,
                message: 'Tileset not found',
            })
        }

        // Checks if tileset belongs to the User who is trying to delete it
        if (tileset.ownerId != req.params.ownerId) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this tileset',
            })
        }

        // Finds tileset with given id and deletes it
        Tileset.findByIdAndDelete(req.params.id, (err, tileset) => {
            return res.status(200).json({
                success: true,
                data: tileset
            })
        }).catch(err => console.log(err))

    })

}

updateTileset = async (req, res) => {

    // Checks if request contains any body data
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: "No body was given by the client",
        })
    }

    Tileset.findOne({ _id: req.params.id }, async (err, tileset) => {

        // Checks if tileset exists
        if (err) {
            return res.status(404).json({
                err,
                message: "Tileset not found"
            })
        }

        // Changes all the present fields
        const { _id, tilesetName, tilesetDesc, tilesetBackgroundColor, tilesetTags, imagePixelHeight, imagePixelWidth, tileHeight, tileWidth, padding, source, ownerId, collaboratorIds, isPublic, isLocked, tiles } = req.body;

        if (tilesetName) {
            if (tilesetName == "") {

                tilesetName = "Untitled"
                let untitled_num = 1

                const existingUntitledTileset = await Tileset.findOne({
                    _id: _id,
                    tilesetName: tilesetName
                });

                while (existingUntitledTileset) {
                    tilesetName = "Untitled" + untitled_num
                    untitled_num++
                }

            }
            tileset.tilesetName = tilesetName
        }
        if (tilesetDesc) {
            if (tilesetDesc == "") {
                tilesetDesc = "No description"
            }
            tileset.tilesetDesc = tilesetDesc
        }
        if (tilesetTags)
            tileset.tilesetTags = tilesetTags
        if (tilesetBackgroundColor)
            tileset.tilesetBackgroundColor = tilesetBackgroundColor
        if (imagePixelHeight)
            tileset.imagePixelHeight = imagePixelHeight
        if (imagePixelWidth)
            tileset.imagePixelWidth = imagePixelWidth
        if (tileHeight)
            tileset.tileHeight = tileHeight
        if (tileWidth)
            tileset.tileWidth = tileWidth
        if (padding)
            tileset.padding = padding
        if (source)
            tileset.source = source
        if (ownerId)
            tileset.ownerId = ownerId
        if (collaboratorIds)
            tileset.collaboratorIds = collaboratorIds
        if (isPublic)
            tileset.isPublic = isPublic
        if (isLocked)
            tileset.isLocked = isLocked
        if (tiles)
            tileset.tiles = tiles

        // Attempts to save updated tileset
        tileset
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: tileset._id,
                    message: 'Tileset was successfully updated',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Tileset was not updated',
                })
            })

    })

}

getAllUserTilesets = async (req, res) => {

    const { ownerId } = req.query;
    await Tileset.find({ ownerId: ownerId }, (err, tilesets) => {

        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        if (!tilesets) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: "Tilesets could not be found"
                })
        }
        else {
            // Alls all User's tilesets to array of data
            let tilesetsData = [];
            for (key in tilesets) {

                let tileset = tilesets[key]
                let tilesetData = {

                    _id: tileset._id,
                    tilesetName: tileset.tilesetName,
                    tilesetDesc: tileset.tilesetDesc,
                    tilesetBackgroundColor: tileset.tilesetBackgroundColor,
                    imagePixelHeight: tileset.imagePixelHeight,
                    imagePixelWidth: tileset.imagePixelWidth,
                    tileHeight: tileset.tileHeight,
                    tileWidth: tileset.tileWidth,
                    tiles: tileset.tiles,
                    source: tileset.source,
                    ownerId: tileset.ownerId,
                    collaboratorIds: tileset.collaboratorIds,
                    isPublic: tileset.isPublic

                }

                tilesetsData.push(tilesetData)

            }
            return res.status(200).json({
                success: true,
                tilesets: tilesetsData
            })
        }
    }).catch(err => console.log(err));

}

getUserTilesetsByName = async (req, res) => {

    const { userName, name } = req.query;
    await Tileset.find({ userName: userName }, (err, tilesets) => {

        if (err) {
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        if (!tilesets) {
            return res
                .status(404)
                .json({
                    success: false,
                    error: "Tilesets could not be found"
                })
        }
        else {
            // Alls all User's tilesets to array of data
            let tilesetsData = [];
            for (key in tilesets) {

                let tileset = tilesets[key]

                //Checks if Tileset matches or begins with the wanted name/search
                if (tileset.name.toLowerCase().startsWith(name.toLowerCase()) && name) {
                    let tilesetData = {

                        _id: tileset._id,
                        tilesetName: tileset.tilesetName,
                        tilesetDesc: tileset.tilesetDesc,
                        tilesetBackgroundColor: tileset.tilesetBackgroundColor,
                        imagePixelHeight: tileset.imagePixelHeight,
                        imagePixelWidth: tileset.imagePixelWidth,
                        tileHeight: tileset.tileHeight,
                        tileWidth: tileset.tileWidth,
                        tiles: tileset.tiles,
                        source: tileset.source,
                        ownerId: tileset.ownerId,
                        collaboratorIds: tileset.collaboratorIds,
                        isPublic: tileset.isPublic

                    }

                    tilesetsData.push(tilesetData)
                }
            }
            return res.status(200).json({
                success: true,
                tilesets: tilesetsData
            })
        }
    }).catch(err => console.log(err));

}

getTilesetbyId = async (req, res) => {
    const savedTileset = await Tileset.findById(req.params.id);
    return res.status(200).json({
        tileset: savedTileset
    }).send();
}


module.exports = {
    getAllUserTilesets,
    getUserTilesetsByName,
    getTilesetbyId,
    createTileset,
    deleteTileset,
    updateTileset
}
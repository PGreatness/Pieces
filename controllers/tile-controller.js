const mongoose = require('mongoose');
const tile = require('../models/tile-model')
const tileset = require('../models/tileset-model')

/**
 * @desc    create a new tile
 * @route   POST /api/tile/createTile
 * @access  Private
 * @param   {ObjectId}    tilesetId
 * @param   {string}      height
 * @param   {string}      width
 * @param   {string}      userId
 * @param   {string}      tileData
 */
var createTile = async (req, res) => {
    const { tilesetId, height, width, userId, tileData, tileImage } = req.body;

    try {
        // TOMMMY commented out userId check for testing purposes as of writing this

        if (!tilesetId || !height || !width || !tileData /*|| !userId*/) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a tilesetId, height, tileData, and width',
                body: req.body
            });
        }

        if (height < 1 || width < 1) {
            return res.status(400).json({
                success: false,
                error: 'Height and width must be greater than 0',
            });
        }

        if (height > 100 || width > 100) {
            return res.status(400).json({
                success: false,
                error: 'Height and width must be less than 100',
            });
        }

        // if (tileData?.length == 0) {
        //     tileData = ['rgba(0,0,0,0)'];
        // }

        const userTileset = await tileset.findOne({ _id: tilesetId });
        console.log(userTileset);

        if (!userTileset) {
            return res.status(400).json({
                success: false,
                error: 'Tileset not found',
            });
        }
        console.log(userTileset.ownerId.toString());
        console.log(userId?.toString());
        // Commented out by TOMMY for testing purposes
        // if (userTileset.ownerId?.toString() != userId.toString()) {
        //     return res.status(400).json({
        //         success: false,
        //         error: 'You do not own this tileset',
        //     });
        // }else {
        //     for (let i = 0; i < userTileset.collaboratorIds.length; i++) {
        //         if (userTileset.collaboratorIds[i].toString() == userId) {
        //             return res.status(400).json({
        //                 success: false,
        //                 error: 'You do not own this tileset',
        //             });
        //         }
        //     }
        // }

        if (userTileset.tileHeight != height || userTileset.tileWidth != width) {
            return res.status(400).json({
                success: false,
                error: 'Tile height and width must equal to the tileset height and width',
            });
        }


        const newTile = new tile({
            tilesetId,
            height,
            width,
            tileData,
            tileImage
        });

        let savedTile = await newTile.save();
        if (!savedTile) {
            return res.status(400).json({
                success: false,
                error: 'Tile not created!',
            });
        }
        let updatedTileset = await tileset.findOneAndUpdate({ _id: tilesetId }, { $push: { tiles: savedTile._id } }, { new: true });
        if (!updatedTileset) {
            return res.status(400).json({
                success: false,
                error: 'Tileset not updated!',
            });
        }
        console.log("TILE CREATED SUCCESSFULLY")
        return res.status(200).json({
            success: true,
            id: savedTile._id,
            tileset: updatedTileset,
            tile: savedTile,
            message: 'Tile created!',
        });
    } catch (err) {
        console.log(err);
        return res.status(503).json({
            err,
            message: 'An error occurred',
        });
    }
}

/**
 * @desc    update a tile
 * @route   POST /api/tile/updateTile
 * @access  Private
 * @param   {ObjectId}    userId
 * @param   {string}      tileId
 * @param   {string}      tileData
 */
var updateTile = async (req, res) => {

    try {
        if (!req.body.tileId) {
            return res.status(400).json({
                success: false,
                error: 'You must provide an id to update',
            });
        }

        let { tileId, userId, tileData, tileImage } = req.body;

        let userTile = await tile.findOne({ _id: tileId });
        if (!userTile) {
            return res.status(400).json({
                success: false,
                error: 'Tile not found',
            });
        }

        let userTileset = await tileset.findOne({ _id: userTile.tilesetId });
        if (userTileset.ownerId.toString() != userId.toString()) {
            return res.status(400).json({
                success: false,
                error: 'You do not own this tile',
            });
        } else {
            for (let i = 0; i < userTileset.collaboratorIds.length; i++) {
                if (userTileset.collaboratorIds[i] == userId) {
                    return res.status(400).json({
                        success: false,
                        error: 'You do not own this tile',
                    });
                }
            }
        }

        let updatedTile;
        if (tileData) {
            if (tileData.length == 0 && userTile.tileData.length == 0) {
                tileData.push('rgba(0,0,0,0)');
            }
            if (tileData.length == 0) {
                tileData = userTile.tileData;
            }
            updatedTile = await tile.findOneAndUpdate({ _id: tileId }, { tileData }, { new: true });
        }
        if (tileImage) {
            updatedTile = await tile.findOneAndUpdate({ _id: tileId }, { tileImage }, { new: true });
        }

        if (!updatedTile) {
            return res.status(400).json({
                success: false,
                error: 'Tile not updated',
            });
        }
        return res.status(200).json({
            success: true,
            tile: updatedTile,
            message: 'Tile updated!',
        });

        // if (tileImage) {
        //     let updatedTile = await tile.findOneAndUpdate({_id: tileId}, {tileImage}, {new: true});
        //     if (!updatedTile) {
        //         return res.status(400).json({
        //             success: false,
        //             error: 'Tile not updated',
        //         });
        //     }
        //     return res.status(200).json({
        //         success: true,
        //         tile: updatedTile,
        //         message: 'Tile updated!',
        //     });
        // }
    } catch (err) {
        console.log(err);
        return res.status(503).json({
            message: 'An error occurred',
        });
    }
}

/**
 * @desc    delete a tile
 * @route   POST /api/tile/deleteTile
 * @access  Private
 * @param   {string}      userId
 * @param   {ObjectId}    tileId
 */
var deleteTile = async (req, res) => {
    try {
        if (!req.body.tileId) {
            return res.status(400).json({
                success: false,
                error: 'You must provide a tile id',
            });
        }
        const userTile = await tile.findOne({ _id: req.body.tileId });
        if (!userTile) {
            return res.status(400).json({
                success: false,
                error: 'Tile not found',
            });
        }

        const userTileset = await tileset.findOne({ _id: userTile.tilesetId });
        if (userTileset.ownerId.toString() !== req.body.userId.toString()) {
            return res.status(400).json({
                success: false,
                error: 'You do not own this tile',
            });
        } else {
            for (let i = 0; i < userTileset.collaboratorIds.length; i++) {
                if (userTileset.collaboratorIds[i] == req.body.userId) {
                    return res.status(400).json({
                        success: false,
                        error: 'You do not own this tile',
                    });
                }
            }
        }


        tile.findOneAndDelete({ _id: req.body.tileId }).then((deletedTile) => {
            if (!deletedTile) {
                return res.status(400).json({
                    success: false,
                    error: 'Tile not deleted',
                });
            }

            tileset.updateMany({ tiles: deletedTile._id }, { $pull: { tiles: deletedTile._id } }).then((result) => {
                console.log("RESULT")
                console.log(result)
                return res.status(200).json({
                    success: true,
                    tileset_id: userTileset._id,
                    id: tile._id,
                    message: 'Tile deleted!',
                });
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(503).json({
            message: 'An error occurred',
        });
    }
}

/**
 * @desc    get all tiles
 * @route   GET /api/tile/getAllTiles
 * @access  Private
 * @param   None
 */
var getAllTiles = async (req, res) => {
    try {
        let allTiles = await tile.find({});
        if (allTiles.length == 0) {
            return res.status(400).json({
                success: false,
                error: 'No tiles found',
            });
        }
        return res.status(200).json({
            success: true,
            tiles: allTiles,
        });
    } catch (err) {
        console.log(err);
        return res.status(503).json({
            message: 'An error occurred',
        });
    }
}

/**
 * @desc    get specific tile
 * @route   GET /api/tile/:id
 * @access  Private
 * @param   {ObjectId}    id
 */
var getTileById = async (req, res) => {
    try {

        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                error: 'You must provide an id',
            });
        }

        let tilesId = await tile.findOne({ _id: req.params.id });
        //console.log(tilesId)
        if (!tilesId) {
            return res.status(400).json({
                success: false,
                error: 'Tile not found',
            });
        }
        return res.status(200).json({
            success: true,
            tile: tilesId,
        });
    } catch (err) {
        console.log(err);
        return res.status(503).json({
            message: 'An error occurred',
        });
    }
}


var getTilesetTiles = async (req, res) => {
    try {

        if (!req.params.id) {
            return res.status(400).json({
                success: false,
                error: 'You must provide an id',
            });
        }

        const savedTileset = await tileset.findById(req.params.id);
        if (savedTileset == null) {
            return res.status(404).json({
                success: false,
                message: "Tileset not found"
            });
        }

        let tiles = await tile.find({ tilesetId: req.params.id });
        //console.log(tiles)
        if (!tiles) {
            return res.status(400).json({
                success: false,
                error: 'Tiles not found',
            });
        }
        return res.status(200).json({
            success: true,
            tiles: tiles,
        });
    } catch (err) {
        console.log(err);
        return res.status(503).json({
            message: 'An error occurred',
        });
    }
}



module.exports = {
    createTile,
    updateTile,
    deleteTile,
    getTileById,
    getAllTiles,
    getTilesetTiles
}
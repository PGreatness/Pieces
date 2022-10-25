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
createTile = async (req, res) => {
    const { tilesetId, height, width, userId, tileData } = req.body;

    console.log(userId);
    if (!tilesetId || !height || !width || !tileData || !userId) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a tilesetId, height, tileData, and width',
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

    if (tileData?.length == 0) {
        tileData = ['rgba(0,0,0,0)'];
    }

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
    if (userTileset.ownerId?.toString() != userId.toString()) {
        return res.status(400).json({
            success: false,
            error: 'You do not own this tileset',
        });
    }else {
        for (let i = 0; i < userTileset.collaboratorIds.length; i++) {
            if (userTileset.collaboratorIds[i].toString() == userId) {
                return res.status(400).json({
                    success: false,
                    error: 'You do not own this tileset',
                });
            }
        }
    }

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
        tileData
    });

    let savedTile = await newTile.save();
    if (!savedTile) {
        return res.status(400).json({
            success: false,
            error: 'Tile not created!',
        });
    }
    let updatedTileset = await tileset.findOneAndUpdate({ _id: tilesetId }, { $push: { tileIds: savedTile._id } }, { new: true });
    if (!updatedTileset) {
        return res.status(400).json({
            success: false,
            error: 'Tileset not updated!',
        });
    }
    return res.status(200).json({
        success: true,
        id: savedTile._id,
        message: 'Tile created!',
    });
}

/**
 * @desc    update a tile
 * @route   POST /api/tile/updateTile
 * @access  Private
 * @param   {ObjectId}    userId
 * @param   {string}      tileId
 * @param   {string}      tileData
 */
updateTile = async (req, res) => {
    if (!req.body.tileId) {
        console.log(req.body.tileId);
        return res.status(400).json({
            success: false,
            error: 'You must provide an id to update',
        });
    }

    const { tileId, userId, tileData } = req.body;

    const userTile = await tile.findOne({ _id: tileId });
    if (!userTile) {
        return res.status(400).json({
            success: false,
            error: 'Tile not found',
        });
    }

    console.log(userTile);
    const userTileset = await tileset.findOne({ _id: userTile.tilesetId });
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

    if (tileData.length == 0 && userTile.tileData.length == 0) {
        tileData.push('rgba(0,0,0,0)');
    }
    if (tileData.length == 0) {
        tileData = userTile.tileData;
    }

    let updatedTile = await tile.findOneAndUpdate({ _id: tileId }, { tileData }, { new: true });
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
}

/**
 * @desc    delete a tile
 * @route   POST /api/tile/deleteTile
 * @access  Private
 * @param   {string}      userId
 * @param   {ObjectId}    tileId
 */
deleteTile = async (req, res) => {
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

    return await tile.findOneAndDelete({ _id: req.body.tileId }, (error, tile) => {
        if (error) {
            return res.status(400).json({
                error,
                message: 'Tile not deleted!',
            });
        }
        tileset.updateMany({ tiles: tile._id }, { $pull: { tiles: tile._id } }).then(() => {
            return res.status(200).json({
                success: true,
                id: tile._id,
                message: 'Tile deleted!',
            });
        });
    });
}

/**
 * @desc    get all tiles
 * @route   GET /api/tile/getAllTiles
 * @access  Private
 * @param   None
 */
getAllTiles = async (req, res) => {
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
}

/**
 * @desc    get specific tile
 * @route   GET /api/tile/:id
 * @access  Private
 * @param   {ObjectId}    id
 */
getTileById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an id',
        });
    }
    let tilesId = await tile.findOne({ _id: req.params.id });
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
}

module.exports = {
    createTile,
    updateTile,
    deleteTile,
    getTileById,
    getAllTiles
}
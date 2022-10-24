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
 */
createTile = async (req, res) => {
    const { tilesetId, height, width } = req.body;

    if (!tilesetId || !height || !width) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a tilesetId, height, and width',
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

    const userTileset = await tileset.findOne({ _id: tilesetId });
    console.log(userTileset);

    if (!userTileset) {
        return res.status(400).json({
            success: false,
            error: 'Tileset not found',
        });
    }
    console.log(userTileset.ownerId.toString());
    console.log(req.body.userId?.toString());
    if (userTileset.ownerId?.toString() != req.body.userId.toString()) {
        return res.status(400).json({
            success: false,
            error: 'You do not own this tileset',
        });
    }else {
        for (let i = 0; i < userTileset.collaboratorIds.length; i++) {
            if (userTileset.collaboratorIds[i].toString() == req.body.userId) {
                return res.status(400).json({
                    success: false,
                    error: 'You do not own this tileset',
                });
            }
        }
    }

    const newTile = new tile({
        _id: new mongoose.Types.ObjectId(),
        tilesetId,
        height,
        width
    });
    newTile.save().then(() => {
        return res.status(201).json({
            success: true,
            id: newTile._id,
            message: 'Tile created!',
        });
    }).catch(error => {
        return res.status(400).json({
            error,
            message: 'Tile not created!',
        });
    });
}

/**
 * @desc    update a tile
 * @route   POST /api/tile/updateTile
 * @access  Private
 * @param   {ObjectId}    userId
 * @param   {string}      height
 * @param   {string}      width
 * @param   {string}      tileId
 */
updateTile = async (req, res) => {
    if (!req.body.tileId) {
        console.log(req.body.tileId);
        return res.status(400).json({
            success: false,
            error: 'You must provide an id to update',
        });
    }

    const { height, width } = req.body;

    if (!height || !width) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a height and width',
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

    const userTile = await tile.findOne({ _id: req.body.tileId });
    if (!userTile) {
        return res.status(400).json({
            success: false,
            error: 'Tile not found',
        });
    }

    console.log(userTile);
    const userTileset = await tileset.findOne({ _id: userTile.tilesetId });
    if (userTileset.ownerId.toString() != req.body.userId.toString()) {
        return res.status(400).json({
            success: false,
            error: 'You do not own this tile',
        });
    } else {
        for (let i = 0; i < userTileset.collaboratorIds.length; i++) {
            if (userTileset.collaboratorIds[i] == req.body.id) {
                return res.status(400).json({
                    success: false,
                    error: 'You do not own this tile',
                });
            }
        }
    }

    let updatedTile = await tile.findOneAndUpdate({ _id: req.body.tileId }, { height, width }, { new: true });
    if (!updatedTile) {
        return res.status(400).json({
            success: false,
            error: 'Tile not updated',
        });
    }
    return res.status(200).json({
        success: true,
        tile: updatedTile,
    });
}

/**
 * @desc    delete a tile
 * @route   POST /api/tile/deleteTile
 * @access  Private
 * @param   {string}      userId
 * @param   {ObjectId}    tilesetId
 */
deleteTile = async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a tile id',
        });
    }
    const userTile = await tile.findOne({ _id: req.body.id });
    if (!userTile) {
        return res.status(400).json({
            success: false,
            error: 'Tile not found',
        });
    }

    const userTileset = await tileset.findOne({ _id: userTile.tilesetId });
    if (userTileset.ownerId.toString() !== req.body.ownerId.toString()) {
        return res.status(400).json({
            success: false,
            error: 'You do not own this tile',
        });
    } else {
        for (let i = 0; i < userTileset.collaboratorIds.length; i++) {
            if (userTileset.collaboratorIds[i] == req.body.ownerId) {
                return res.status(400).json({
                    success: false,
                    error: 'You do not own this tile',
                });
            }
        }
    }

    return await tile.findOneAndDelete({ _id: req.body.id }, (error, tile) => {
        if (error) {
            return res.status(400).json({
                error,
                message: 'Tile not deleted!',
            });
        }
        return res.status(200).json({
            success: true,
            id: tile._id,
            message: 'Tile deleted!',
        });
    }).catch(error => {
        return res.status(400).json({
            error,
            message: 'Tile not deleted!',
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
 * @param   {ObjectId}    tileId
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
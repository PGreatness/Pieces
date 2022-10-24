const tile = require('../models/tile-model')
const tileset = require('../models/tileset-model')

createTile = (req, res) => {
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

    const userTileset = tileset.findOne({ _id: tilesetId });
    if (!userTileset) {
        return res.status(400).json({
            success: false,
            error: 'Tileset not found',
        });
    }
    if (userTileset.ownerId !== req.user.id) {
        return res.status(400).json({
            success: false,
            error: 'You do not own this tileset',
        });
    }

    if (!userTileset.collaboratorIds.includes(req.user.id)) {
        return res.status(400).json({
            success: false,
            error: 'You do not own this tileset',
        });
    }

    const newTile = new tile({
        tilesetId,
        height,
        width,
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

updateTile = async (req, res) => {
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

    const userTile = tile.findOne({ _id: req.params.id });
    if (!userTile) {
        return res.status(400).json({
            success: false,
            error: 'Tile not found',
        });
    }

    const userTileset = tileset.findOne({ _id: userTile.tilesetId });
    if (userTileset.ownerId !== req.user.id) {
        return res.status(400).json({
            success: false,
            error: 'You do not own this tile',
        });
    }

    if (!userTileset.collaboratorIds.includes(req.user.id)) {
        return res.status(400).json({
            success: false,
            error: 'You do not own this tile',
        });
    }

    tile.findOneAndUpdate({ _id: req.params.id }, { height, width }, (error, tile) => {
        if (error) {
            return res.status(400).json({
                error,
                message: 'Tile not updated!',
            });
        }
        return res.status(200).json({
            success: true,
            id: tile._id,
            message: 'Tile updated!',
        });
    });
}

deleteTile = async (req, res) => {
    const userTile = tile.findOne({ _id: req.params.id });
    if (!userTile) {
        return res.status(400).json({
            success: false,
            error: 'Tile not found',
        });
    }

    const userTileset = tileset.findOne({ _id: userTile.tilesetId });
    if (userTileset.ownerId !== req.user.id) {
        return res.status(400).json({
            success: false,
            error: 'You do not own this tile',
        });
    }

    if (!userTileset.collaboratorIds.includes(req.user.id)) {
        return res.status(400).json({
            success: false,
            error: 'You do not own this tile',
        });
    }

    tile.findOneAndDelete({ _id: req.params.id }, (error, tile) => {
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
    });
}

getTileById = async (req, res) => {
    await tile.findOne({ _id: req.params.id }, (error, tile) => {
        if (error) {
            return res.status(400).json({
                error,
                message: 'Tile not found!',
            });
        }
        return res.status(200).json({
            success: true,
            tile,
        });
    });
}

getAllTiles = async (req, res) => {
    await tile.find({}, (error, tiles) => {
        if (error) {
            return res.status(400).json({
                error,
                message: 'Tiles not found!',
            });
        }
        return res.status(200).json({
            success: true,
            tiles,
        });
    });
}

getTileById = async (req, res) => {
    await tile.findOne({ _id: req.params.id }, (error, tile) => {
        if (error) {
            return res.status(400).json({
                error,
                message: 'Tile not found!',
            });
        }
        return res.status(200).json({
            success: true,
            tile,
        });
    });
}

module.exports = {
    createTile,
    updateTile,
    deleteTile,
    getTileById,
    getAllTiles
}
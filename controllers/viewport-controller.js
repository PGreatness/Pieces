const Map = require('../models/map-model');
const User = require('../models/user-model')
const Tileset = require('../models/tileset-model')
const Tile = require('../models/tile-model')
const ProjectComment = require('../models/project-comment-model')
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require('mongoose')

const createMapViewport = async (req, res) => {
    const { mapId } = req.body;
    var { width, height, startingLocationObject } = req.body;

    console.log(mapId, width, height, startingLocationObject)

    if (!mapId) {
        return res.status(400).send({ message: 'Map ID is required' })
    }

    if (!width) {
        width = 32;
    }

    if (!height) {
        height = 32;
    }

    if (!startingLocationObject) {
        startingLocationObject = {
            x: 0,
            y: 0
        }
    }

    const map = await Map.findById(mapId);

    if (!map) {
        return res.status(400).send({ message: 'Map not found' })
    }

    var startingIndex = +startingLocationObject.x + (+startingLocationObject.y * map.mapWidth);

    var viewportData = [];
    var tilesetData = [];
    let min = Math.min(width, map.mapWidth);
    console.log('min', min)
    let minHeight = Math.min(height, map.mapHeight);
    console.log('minHeight', minHeight)
    let currentMapIndex = startingIndex;
    console.log('going to loop for ', minHeight * map.mapHeight, ' tiles divided by ', map.mapWidth, ' tiles per row')
    console.log(`tiles length is: ${map.tiles.length}`)
    console.log(`map width is: ${map.mapWidth}, map height is: ${map.mapHeight}`)
    for (let i = startingIndex; i < (minHeight * map.mapHeight) + (+startingLocationObject.y * map.mapWidth); i+= map.mapWidth) {
        let row = map.tiles.slice(i, i + min);
        console.log(`from ${i} to ${i + min} is ${row.length} tiles`)
        let values = Array.from({length: (i + min) - currentMapIndex}, (_, i) => i + currentMapIndex);
        currentMapIndex += map.mapWidth;
        viewportData.push(row);
        tilesetData.push(values);
    }

    console.log('viewport', viewportData[0].length)

    // console.log(viewportData?.length != 0, viewportData[0]?.length != 0)
    height = minHeight;
    width = min;
    viewportData = viewportData.flat();
    tilesetData = tilesetData.flat();

    // console.log(viewportData, height, width, map.mapHeight, map.mapWidth)
    if (viewportData.length === 0) {
        // console.log('viewport is empty')
        // console.log(height * width)
        for (let i = 0; i < min * minHeight; i++) {
            viewportData.push(-1);
        }
        console.log('viewport after change', viewportData.length)
    }

    // console.log('viewport now', viewportData)
    var tilesets = [];
    for (let i = 0; i < map.tilesets.length; i++) {
        var tiles = await Tile.find({ tilesetId: map.tilesets[i] });
        tilesets.push(tiles);
    }

    tilesets = tilesets.flat();


    var viewport = {
        ...map,
        tiles: viewportData,
        height: height,
        width: width,
        tilesets: tilesets,
        tilesetData: tilesetData,
        start: startingLocationObject
    }

    return res.status(200).send(viewport)
}

const updateMapToViewport = async (req, res) => {
    const { mapId, viewport } = req.body;

    if (!mapId) {
        return res.status(400).send({ message: 'Map ID is required' })
    }

    if (!viewport) {
        return res.status(400).send({ message: 'Viewport is required' })
    }

    const map = await Map.findById(mapId);

    if (!map) {
        return res.status(400).send({ message: 'Map not found' })
    }

    map.tiles = viewport;

    await map.save().then(() => {
        return res.status(200).send({ message: 'Map updated successfully' })
    }).catch((err) => {
        return res.status(400).send({ message: 'Error updating map' })
    })
}

const getMapTiles = async (req, res) => {
    const { mapId } = req.body;

    if (!mapId) {
        return res.status(400).send({ message: 'Map ID is required' })
    }

    const map = await Map.findById(mapId);

    if (!map) {
        return res.status(400).send({ message: 'Map not found' })
    }

    var tilesets = [];
    for (let i = 0; i < map.tilesets.length; i++) {
        var tiles = await Tile.find({ tilesetId: map.tilesets[i] });
        tilesets.push(tiles);
    }

    tilesets = tilesets.flat();

    return res.status(200).send(tilesets)
}



module.exports = {
    createMapViewport,
    updateMapToViewport,
    getMapTiles
}

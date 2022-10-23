const Tileset = require('../models/tileset-model')

createTileset = (req, res) => {
    try {
        const { tilesetName, imagePixelHeight, imagePixelWidth, tileHeight, tileWidth, source, ownerId, isPublic, isLocked, tiles} = req.body;
        if (!imagePixelHeight || !imagePixelWidth || !tileHeight || !tileWidth || !source || !ownerId || !isPublic || !isLocked || !tiles) {
            return res
                .status(400)
                .json({ errorMessage: "Something went wrong with tileset input." })
        }
        if (!tilesetName) {
            tilesetName = "Untitled";
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
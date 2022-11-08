const Tileset = require('../models/tileset-model')
var mongoose = require('mongoose');
const User = require('../models/user-model')
const ProjectComments = require('../models/project-comment-model')

createTileset = async (req, res) => {
    try {
        const { tilesetName, imagePixelHeight, imagePixelWidth, tileHeight, tileWidth, source, ownerId, isPublic, isLocked } = req.body;
        if (!tilesetName || !imagePixelHeight || !imagePixelWidth || !tileHeight || !tileWidth || !source || !ownerId || (isPublic == null) || (isLocked == null)) {
            return res
                .status(400)
                .json({ message: "Empty required fields." })
        }

        const objectOwnerId = mongoose.Types.ObjectId(ownerId)
        console.log(objectOwnerId)

        // Checks if another one of the user's tilesets already has the given name,
        // If so, tileset is not created.
        const existingTileset = await Tileset.findOne({
            ownerId: objectOwnerId,
            tilesetName: tilesetName
        });
        if (existingTileset) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Another Tileset owned by the same User already has this name."
                })
        }

        // If name is not specified, "Untitled" is given as default
        // If "Untitled" is already taken, "Untitled1" is given instead and so on
        if (tilesetName == "") {

            tilesetName = "Untitled"
            let untitled_num = 1

            let existingUntitledTileset = await Tileset.findOne({
                ownerId: objectOwnerId,
                tilesetName: tilesetName
            });

            while (existingUntitledTileset) {
                tilesetName = "Untitled" + untitled_num
                existingUntitledTileset = await Tileset.findOne({
                    ownerId: objectOwnerId,
                    tilesetName: tilesetName
                });
                untitled_num++
            }

        }

        const tilesetDesc = "No description"
        const tilesetTags = []
        const tilesetBackgroundColor = ""
        const padding = 0
        const collaboratorIds = []
        const tiles = []

        let newTileset = new Tileset({
            tilesetName: tilesetName,
            tilesetDesc: tilesetDesc,
            tilesetTags: tilesetTags,
            tilesetBackgroundColor: tilesetBackgroundColor,
            imagePixelHeight: imagePixelHeight,
            imagePixelWidth: imagePixelWidth,
            tileHeight: tileHeight,
            tileWidth: tileWidth,
            padding: padding,
            source: source,
            ownerId: objectOwnerId,
            collaboratorIds: collaboratorIds,
            isPublic: isPublic,
            isLocked: isLocked,
            tiles: tiles,
            likes: [],
            dislikes: [],
            comments: [],
            favs: [],
            downloads: 0
        });

        newTileset.save().then(() => {
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
        return res.status(500).send();
    }
}

deleteTileset = async (req, res) => {
    if (req.query.id == undefined) {
        return res.status(404).json({
            err,
            message: 'ID empty',
        })
    }
    if (req.query.ownerId == undefined) {
        return res.status(404).json({
            err,
            message: 'ownerId empty',
        })
    }

    let id = mongoose.Types.ObjectId(req.query.id)
    let ObjectOwnerId = mongoose.Types.ObjectId(req.query.ownerId)

    Tileset.findById({ _id: id }, (err, tileset) => {

        // Checks if Tileset with given id exists
        if (err) {
            return res.status(404).json({
                err,
                message: 'Tileset not found',
            })
        }

        // Checks if tileset belongs to the User who is trying to delete it
        if (!tileset.ownerId.equals(ObjectOwnerId)) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this tileset',
            })
        }

        // Delete all the comments on the tileset
        ProjectComments.deleteMany({ projectId: id }, (err, comments) => {
            if (err) {
                return res.status(400).json({
                    err,
                    message: 'Failed to delete comments',
                })
            }
        })

        // TODO: Delete the tileset from the User's favs list

        // Finds tileset with given id and deletes it
        Tileset.findByIdAndDelete(id, (err, tileset) => {
            return res.status(200).json({
                success: true,
                data: tileset
            })
        }).catch(err => console.log(err))

    })
}

updateTileset = async (req, res) => {
    if (req.query.id == undefined) {
        return res.status(404).json({
            message: 'ID empty',
        })
    }
    if (req.query.ownerId == undefined) {
        return res.status(404).json({
            message: 'ownerId empty',
        })
    }

    let id = mongoose.Types.ObjectId(req.query.id)
    let ObjectOwnerId = mongoose.Types.ObjectId(req.query.ownerId)

    Tileset.findOne({ _id: id }, async (err, tileset) => {

        // Checks if tileset exists
        if (err) {
            return res.status(404).json({
                err,
                message: "Tileset not found"
            })
        }

        // Checks if tileset belongs to the User who is trying to update it
        // if (!tileset.ownerId.equals(ObjectOwnerId)) {
        //     return res.status(401).json({
        //         err,
        //         message: 'User does not have ownership of this tileset',
        //     })
        // }

        // Changes all the present fields
        const { tilesetName, tilesetDesc, tilesetBackgroundColor, tilesetTags, imagePixelHeight, imagePixelWidth, tileHeight, tileWidth,
            padding, source, ownerId, collaboratorIds, isPublic, isLocked, tiles, likes, dislikes, favs, downloads, comments } = req.body;

        if (tilesetName) {
            if (tilesetName == "") {

                tilesetName = "Untitled"
                let untitled_num = 1

                let existingUntitledTileset = await Tileset.findOne({
                    _id: id,
                    tilesetName: tilesetName
                });

                while (existingUntitledTileset) {
                    tilesetName = "Untitled" + untitled_num
                    existingUntitledTileset = await Tileset.findOne({
                        _id: id,
                        tilesetName: tilesetName
                    });
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
        if (likes)
            tileset.likes = likes
        if (dislikes)
            tileset.dislikes = dislikes
        if (favs)
            tileset.favs = favs
        if (downloads)
            tileset.downloads = downloads
        if (comments)
            tileset.comments = comments


        // Attempts to save updated tileset
        tileset.save().then(() => {
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

    const { tilesetName } = req.query;
    await Tileset.find({}, (err, tilesets) => {

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
                if (tileset.tilesetName.toLowerCase().startsWith(tilesetName.toLowerCase()) && tilesetName) {
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
    console.log(req.params)
    const savedTileset = await Tileset.findById(req.params.id);
    if (savedTileset == null) {
        return res.status(404).json({
            message: "Tileset not found"
        }).send();
    }
    return res.status(200).json({
        tileset: savedTileset
    }).send();
}

publishTileset = async (req, res) => {

    let id = mongoose.Types.ObjectId(req.query.id)
    let ownerObjectId = mongoose.Types.ObjectId(req.query.ownerId)

    Tileset.findOne({ _id: id }, async (err, tileset) => {

        // Checks if Tileset exists
        if (err) {
            return res.status(404).json({
                err,
                message: "Tileset not found"
            })
        }

        // Checks if Tileset belongs to the User
        if (!tileset.ownerId.equals(ownerObjectId)) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this Tileset',
            })
        }

        // Change public
        tileset.isPublic = true

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

var addUserToTileset = async (req, res) => {

    const { tilesetId, userId } = req.body;

    if (!tilesetId || !userId) {
        return res.status(400).json({
            success: false,
            message: "You must provide a tilesetId and userId"
        })
    }

    var tid;
    var uid;
    try {
        tid = mongoose.Types.ObjectId(tilesetId);
        uid = mongoose.Types.ObjectId(userId);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "You must provide a valid tilesetId and userId"
        })
    }

    var user = await User.findById(uid);
    var tileset = await Tileset.findById(tid);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        })
    }

    if (!tileset) {
        return res.status(400).json({
            success: false,
            message: "Tileset does not exist"
        })
    }

    if (tileset.ownerId.equals(uid)) {
        return res.status(400).json({
            success: false,
            message: "User is already the owner of this tileset"
        })
    }

    if (tileset.collaboratorIds.includes(uid)) {
        return res.status(400).json({
            success: false,
            message: "User is already a collaborator of this tileset"
        })
    }

    tileset.collaboratorIds.push(uid);
    tileset.save().then(() => {
        return res.status(200).json({
            success: true,
            message: "User was successfully added to tileset"
        })
    }).catch(err => {
        return res.status(400).json({
            success: false,
            message: "User was not added to tileset"
        })
    })
}

module.exports = {
    getAllUserTilesets,
    getUserTilesetsByName,
    getTilesetbyId,
    createTileset,
    deleteTileset,
    updateTileset,
    publishTileset
}
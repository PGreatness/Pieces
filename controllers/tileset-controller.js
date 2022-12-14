const Tileset = require('../models/tileset-model')
const Tile = require('../models/tile-model')
var mongoose = require('mongoose');
const User = require('../models/user-model')
const ProjectComments = require('../models/project-comment-model')

createTileset = async (req, res) => {
    try {
        const { title, imagePixelHeight, imagePixelWidth, tileHeight, tileWidth, source, ownerId, isPublic, isLocked } = req.body;
        if (!title || !imagePixelHeight || !imagePixelWidth || !tileHeight || !tileWidth || !ownerId || (isPublic == null) || (isLocked == null)) {
            return res
                .status(400)
                .json({ message: "Empty required fields." })
        }

        const objectOwnerId = mongoose.Types.ObjectId(ownerId)
        //console.log(objectOwnerId)

        // Checks if another one of the user's tilesets already has the given name,
        // If so, tileset is not created.
        const existingTileset = await Tileset.findOne({
            ownerId: objectOwnerId,
            title: title
        });
        // if (existingTileset) {
        //     return res
        //         .status(400)
        //         .json({
        //             success: false,
        //             message: "Another Tileset owned by the same User already has this name."
        //         })
        // }

        // If name is not specified, "Untitled" is given as default
        // If "Untitled" is already taken, "Untitled1" is given instead and so on
        if (title == "") {

            title = "Untitled"
            let untitled_num = 1

            let existingUntitledTileset = await Tileset.findOne({
                ownerId: objectOwnerId,
                title: title
            });

            while (existingUntitledTileset) {
                title = "Untitled" + untitled_num
                existingUntitledTileset = await Tileset.findOne({
                    ownerId: objectOwnerId,
                    title: title
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
            title: title,
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
                tileset: newTileset,
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
    if (req.body.id == undefined) {
        return res.status(404).json({
            message: 'ID empty',
        })
    }
    if (req.body.ownerId == undefined) {
        return res.status(404).json({
            message: 'ownerId empty',
        })
    }

    let id = mongoose.Types.ObjectId(req.body.id)
    let ObjectOwnerId = mongoose.Types.ObjectId(req.body.ownerId)

    Tileset.findOne({ _id: id }, (err, tileset) => {

        // Checks if Tileset with given id exists
        if (err) {
            return res.status(404).json({
                err,
                message: 'Tileset not found',
            })
        }

        if (!tileset) {
            return res.status(404).json({
                message: 'Tileset not found'
            })
        }

        //console.log(tileset)
        //console.log(tileset.ownerId)
        //console.log(ObjectOwnerId)
        //console.log(!tileset.ownerId.equals(ObjectOwnerId))
        // Checks if tileset belongs to the User who is trying to delete it
        if (!tileset.ownerId.equals(ObjectOwnerId)) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this tileset',
            })
        }

        // Delete all the comments on the tileset
        const comments = ProjectComments.deleteMany({ projectId: id });

        comments.then((deleted) => {
            if (!deleted) {
                return res.status(400).json({
                    err,
                    message: "Comments were not deleted",
                })
            }

            // Delete the tiles of the tileset
            const tiles = Tile.deleteMany({ tilesetId: id });

            tiles.then((deleted) => {
                if (!deleted) {
                    return res.status(400).json({
                        err,
                        message: "Tiles were not deleted",
                    })
                }
                //console.log('line 169')

                Tileset.findByIdAndDelete(id, (err, tileset) => {
                    return res.status(200).json({
                        success: true,
                        data: tileset,
                        message: 'Tileset deleted!',
                    })
                }).catch(err => console.log(err))
            })
        })
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

    //console.log("checked if ids are undefined")


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

        //console.log("found tileset")


        // Checks if tileset belongs to the User who is trying to update it
        // if (!tileset.ownerId.equals(ObjectOwnerId)) {
        //     return res.status(401).json({
        //         err,
        //         message: 'User does not have ownership of this tileset',
        //     })
        // }

        // Changes all the present fields
        const { title, tilesetDesc, tilesetBackgroundColor, tilesetTags, imagePixelHeight, imagePixelWidth, tileHeight, tileWidth,
            padding, source, ownerId, collaboratorIds, isPublic, isLocked, tiles, likes, dislikes, favs, downloads, comments } = req.body;

        if (title) {
            if (title == "") {

                title = "Untitled"
                let untitled_num = 1

                let existingUntitledTileset = await Tileset.findOne({
                    _id: id,
                    title: title
                });

                while (existingUntitledTileset) {
                    title = "Untitled" + untitled_num
                    existingUntitledTileset = await Tileset.findOne({
                        _id: id,
                        title: title
                    });
                    untitled_num++
                }

            }
            tileset.title = title
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

        //console.log("changed tileset")



        // Attempts to save updated tileset
        tileset.save().then(() => {
            //console.log("saved changes")
            return res.status(200).json({
                success: true,
                id: tileset._id,
                tileset: tileset,
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
                    title: tileset.title,
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

    const { title } = req.query;
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
                if (tileset.title.toLowerCase().startsWith(title.toLowerCase()) && title) {
                    let tilesetData = {

                        _id: tileset._id,
                        title: tileset.title,
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
    //console.log(req.params)
    const savedTileset = await Tileset.findById(req.params.id);
    if (savedTileset == null) {
        return res.status(404).json({
            message: "Tileset not found"
        }).send();
    }
    return res.status(200).json({
        tileset: savedTileset
    })//.send();
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

addUserToTileset = async (req, res) => {

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
            tileset: tileset,
            message: "User was successfully added to tileset"
        })
    }).catch(err => {
        return res.status(400).json({
            success: false,
            message: "User was not added to tileset"
        })
    })
}


removeUserFromTileset = async (req, res) => {

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
            message: "User is the owner of this tileset"
        })
    }

    if (!tileset.collaboratorIds.includes(uid)) {
        return res.status(400).json({
            success: false,
            message: "User is not a collaborator of this tileset"
        })
    }

    tileset.collaboratorIds.remove(uid);
    tileset.save().then(() => {
        return res.status(200).json({
            success: true,
            tileset: tileset,
            message: "User was successfully removed from tileset"
        })
    }).catch(err => {
        return res.status(400).json({
            success: false,
            message: "User was not removed from tileset"
        })
    })
}

publishTileset = async (req, res) => {

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

    Tileset.findOne({ _id: id }, async (err, tileset) => {

        // Checks if Tileset exists
        if (err) {
            return res.status(404).json({
                err,
                message: "Tileset not found"
            })
        }

        if (!tileset) {
            return res.status(404).json({
                message: 'Tileset not found'
            })
        }

        // Checks if Map belongs to the User who is trying to delete it
        if (!tileset.ownerId.equals(ownerObjectId)) {
            return res.status(401).json({
                err,
                message: 'User does not have ownership of this tileset',
            })
        }

        // Change public
        tileset.isPublic = req.body.isPublic

        // Attempts to save updated map
        tileset
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    tileset: tileset,
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

var importTileset = async (req, res) => {
    var { tilesetId, importId } = req.body;

    if (!tilesetId || !importId) {
        return res.status(400).json({
            success: false,
            message: "You must provide a tilesetId and importId"
        })
    }

    var tid;
    var iid;
    try {
        tid = mongoose.Types.ObjectId(tilesetId);
        iid = mongoose.Types.ObjectId(importId);
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "You must provide a valid tilesetId and importId"
        })
    }

    var tileset = await Tileset.findById(tid);
    var importTileset = await Tileset.findById(iid);

    if (!tileset) {
        return res.status(400).json({
            success: false,
            message: "Tileset does not exist"
        })
    }

    if (!importTileset) {
        return res.status(400).json({
            success: false,
            message: "Import Tileset does not exist"
        })
    }

    var importedTiles = []
    const promises = importTileset.tiles.map(async (tile) => {
        foundTile = await Tile.findOne({ _id: tile._id });
        //console.log(foundTile)
        var newTile = new Tile({
            tilesetId: tid,
            width: foundTile.width,
            height: foundTile.height,
            tileData: foundTile.tileData,
            tileImage: foundTile.tileImage
        })
        //console.log(foundTile.tileImage)
        await newTile.save();
        importedTiles.push(newTile);
    })

    Promise.all(promises).then(() => {
        tileset.tiles.push(...importedTiles);
        //console.log("importedTiles is: ", importedTiles);
        //console.log("TILESET CHANGED");
        //console.log(tileset.tiles)
        tileset.save().then(() => {
            return res.status(200).json({
                success: true,
                tileset: tileset,
                message: "Tileset was successfully imported"
            })
        }).catch(err => {
            return res.status(400).json({
                success: false,
                message: "Tileset was not imported"
            })
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
    publishTileset,
    addUserToTileset,
    removeUserFromTileset,
    publishTileset,
    importTileset
}
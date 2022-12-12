import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Modal, Grid, TextField, Button, Typography, Backdrop } from '@mui/material';
import { Edit, IosShare, Clear, LibraryAdd, Check, Add, Visibility } from '@mui/icons-material'
import { Box, Stack } from '@mui/system';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from 'react-router-dom';
import { GlobalStoreContext } from '../../../store/store'
import AuthContext from '../../../auth/auth';
import api from '../../../api/api';
import './css/explore.css';

import './css/exploreItem.css';


export default function ExploreTilesetItem(props) {
    const navigate = useNavigate();
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const project = props.project;

    const [showRequestModal, setShowRequestModal] = useState(false);
    const [tilesetOwner, setTilesetOwner] = useState(null);

    const [likes, setLikes] = useState(project.likes.length);
    const [dislikes, setDislikes] = useState(project.dislikes.length);
    const [isLiked, setIsLiked] = useState(project.likes.includes(auth.user?._id));
    const [isDisliked, setIsDisliked] = useState(project.dislikes.includes(auth.user?._id));
    const [isFav, setIsFav] = useState(project.favs.includes(auth.user?._id));
    const [isUnlocked, setIsUnlocked] = useState(project.collaboratorIds.includes(auth.user?._id) || project.ownerId == auth.user?._id)
    const [openExportTileset, setOpenExportTileset] = useState(false);
    const [showExportError, setShowExportError] = useState(false)


    const handleCloseExportError = () => {
        setShowExportError(false)
    }


    const handleOpenExportTileset = () => {
        setOpenExportTileset(true)
    }

    const handleCloseExportTileset = () => {
        setOpenExportTileset(false)
    }

    const handleLikeClick = (event) => {
        event.stopPropagation();
        store.updateTilesetLikes(project._id, (like_arr, dislike_arr) => {
            setLikes(like_arr.length);
            setDislikes(dislike_arr.length);
            setIsLiked(like_arr.includes(auth.user?._id));
            setIsDisliked(dislike_arr.includes(auth.user?._id));
            setIsUnlocked(project.collaboratorIds.includes(auth.user?._id) || project.ownerId == auth.user?._id)
        });
    }

    const handleDislikeClick = (event) => {
        event.stopPropagation();
        store.updateTilesetDislikes(project._id, (like_arr, dislike_arr) => {
            setLikes(like_arr.length);
            setDislikes(dislike_arr.length);
            setIsLiked(like_arr.includes(auth.user?._id));
            setIsDisliked(dislike_arr.includes(auth.user?._id));
        });
    }

    const handleFavClick = (event) => {
        event.stopPropagation();
        store.updateTilesetFav(project._id, (fav_arr) => {
            setIsFav(fav_arr.includes(auth.user?._id));
        });
    }

    const setLocation = (loc) => {
        props.setLoc(loc);
        navigate(loc);
    }

    const handleConfirmRequest = () => {
        auth.getUserById(project.ownerId, (ownerUser) => {
            setTilesetOwner(ownerUser);
        });
        setShowRequestModal(true)
    }

    const handleCloseAccessRequest = () => {
        setShowRequestModal(false)
    }

    const handleRequestAccess = () => {
        console.log(project._id)
        store.editTilesetRequest(tilesetOwner._id, project._id, project.title)
        setShowRequestModal(false)
    }

    const handleComments = () => {
        props.setShowComments(project)
        props.setCommentsProject(project)
    }

    const openTileset = async function (project) {
        store.changePageToTilesetEditor(project).then(() => {
            store.loadTileset(project._id).then(() => {
                setLocation('/tileset/' + project._id);
                auth.socket.emit('openProject', { project: project._id })
            })
        })

    }

    const handleExportTileset = () => {
        //console.log("exporting tileset")
        let error = false

        store.getTilesetTiles(project._id).then((tiles) => {
            // if tile data = '' then put rgba a equal to 0
            let rgba = []

            tiles.every((tileObj) => {
                let tileData = tileObj.tileData

                if (tileData.every(pixel => pixel === '')) {
                    // cannot import tileset with empty tile
                    error = true
                    setShowExportError(true)
                    return false
                }

                tileData.forEach((tile) => {
                    console.log(tile)
                    if (tile.length === 0) {
                        rgba.push(0)
                        rgba.push(0)
                        rgba.push(0)
                        rgba.push(0)
                    } else {
                        var bigint = parseInt(tile.slice(1), 16);
                        var r = (bigint >> 16) & 255;
                        var g = (bigint >> 8) & 255;
                        var b = bigint & 255;
                        rgba.push(r)
                        rgba.push(g)
                        rgba.push(b)
                        rgba.push(255)

                    }
                })
                return true

            })

            if (error) {
                return
            }

            //console.log(rgba)
            let numTiles = tiles.length
            var rgbaArray = new ImageData(new Uint8ClampedArray(rgba), project.tileWidth, project.tileHeight * numTiles);
            console.log(rgbaArray)

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.height = project.tileHeight * numTiles
            canvas.width = project.tileWidth

            context.putImageData(rgbaArray, 0, 0);

            var img = new Image();
            img.src = canvas.toDataURL();

            var link = document.createElement('a');
            link.download = project.title + '_' + project.tileHeight + 'x' + project.tileWidth;
            link.href = canvas.toDataURL();
            link.click();

            canvas.remove();
            link.remove();

        })

        setOpenExportTileset(false)
    }

    const handlePreviewClick = async () => {
        // if (isUnlocked) {
        //     setLocation('/view/tileset/' + project._id);
        // } else {
        //     handleConfirmRequest();
        // }
        setLocation('/view/tileset/' + project._id);
        await store.loadTileset(project._id)
    }

    return (
        <Box sx={{ boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius: "16px" }}
            style={{ marginBottom: "40px", width: '98%', height: '78%', position: 'relative' }}>
            <img class='image' src={require("../../images/tile.png")} width="100%" height="100%" border-radius="16px" onClick={handlePreviewClick}></img>
            {isUnlocked ?
                <LockOpenIcon className='lock_icon'></LockOpenIcon> :
                <LockIcon className='lock_icon'></LockIcon>
            }
            <div class="overlay">
                <Box style={{ display: 'flex', flexDirection: 'row' }} >
                    <Box style={{ width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} >
                        <Typography style={{ marginLeft: '20px', fontSize: '40px', fontWeight: '700' }} color='azure'>{project.title.length > 15 ? project.title.substring(0, 15) + "..." : project.title}</Typography>
                        <Typography style={{ marginLeft: '20px', fontSize: '20px', fontWeight: '300', paddingBottom: '10px' }} color='azure'>{project.tilesetDesc.length > 25 ? project.tilesetDesc.substring(0, 24) + "..." : project.tilesetDesc}</Typography>
                    </Box>
                    <Box style={{ width: '40%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'end', flexDirection: 'row' }} >
                        <Box style={{ display: 'flex', flexDirection: 'column' }}>
                            <ThumbUpIcon sx={{ fontSize: 40, px: 1, pt: 1, color: `${isLiked ? "#2dd4cf" : "white"}` }}
                                onClick={handleLikeClick} ></ThumbUpIcon>
                            <div class="like_num">{likes}</div>
                        </Box>

                        <Box style={{ display: 'flex', flexDirection: 'column' }}>
                            <ThumbDownIcon sx={{ fontSize: 40, px: 2, pt: 1, color: `${isDisliked ? "#2dd4cf" : "white"}` }}
                                onClick={handleDislikeClick} ></ThumbDownIcon>
                            <div class="like_num">{dislikes}</div>
                        </Box>

                        <CommentIcon sx={{ fontSize: 40, px: 1 }} onClick={handleComments}></CommentIcon>
                        <DownloadIcon sx={{ fontSize: 40, px: 1 }} onClick={handleOpenExportTileset}></DownloadIcon>
                        <FavoriteIcon sx={{ fontSize: 40, px: 1, color: `${isFav ? "#2dd4cf" : "white"}` }}
                            onClick={handleFavClick}></FavoriteIcon>
                        <EditIcon sx={{ fontSize: 40, color: `${isUnlocked ? "white" : "gray"}` }}
                            onClick={isUnlocked ? () => openTileset(project) : handleConfirmRequest} ></EditIcon>
                    </Box>
                </Box>
            </div>


            <Modal
                open={showRequestModal}
                onClose={handleCloseAccessRequest}
                closeAfterTransition
            >
                <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='50%' top='30%' left='30%'>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '50px' }} variant='h3' color='azure'>Request Access to Edit Tileset</Typography>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0px' }} item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '0px', marginRight: '10px', fontSize: '30px' }} color='azure'>Tileset Name:</Typography>
                            <Typography style={{ textAlign: 'center', marginBottom: '0px', marginRight: '10px', fontSize: '30px' }} color='azure'>{project.title}</Typography>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }} item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px', marginRight: '10px', fontSize: '20px' }} color='azure'>Current Collaborators:</Typography>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px', marginRight: '10px', fontSize: '20px' }} color='azure'>{project.collaboratorIds.length + 1}</Typography>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0px' }} item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '0px', marginRight: '10px', fontSize: '30px' }} color='azure'>Tileset Owner:</Typography>
                            <Typography style={{ textAlign: 'center', marginBottom: '0px', marginRight: '10px', fontSize: '30px' }} color='azure'>{tilesetOwner?.firstName} {tilesetOwner?.lastName}</Typography>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '50px' }} item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: 'px', marginRight: '10px', fontSize: '20px' }} color='azure'>Username:</Typography>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px', marginRight: '10px', fontSize: '20px' }} color='azure'>@{tilesetOwner?.userName}</Typography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} item xs={4}>
                            <Button onClick={handleCloseAccessRequest}>
                                Close
                            </Button>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} item xs={4}>
                            <Button onClick={handleRequestAccess}>
                                Request Access
                            </Button>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Box>
            </Modal>

            <Modal
                open={openExportTileset}
                onClose={handleCloseExportTileset}
            >
                <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' height='40%' width='40%' top='30%' left='30%'>
                    <Stack direction='column'>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '50px' }} item xs={12}>
                            <Typography variant='h3' style={{ textAlign: 'center', marginRight: '10px' }} color='azure'>Export Tileset</Typography>
                        </Grid>

                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }} item xs={12}>
                            <Typography style={{ fontSize: '25px', textAlign: 'center', marginRight: '10px' }} color='azure'>Tileset Name: {project.title}</Typography>
                        </Grid>

                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }} item xs={12}>
                            <Typography style={{ fontSize: '25px', textAlign: 'center', marginRight: '10px' }} color='azure'>Num Tiles: {project.tiles.length}</Typography>
                        </Grid>

                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '40px' }} item xs={12}>
                            <Typography style={{ fontSize: '25px', textAlign: 'center', marginRight: '10px' }} color='azure'>Tile Height: {project.tileHeight}</Typography>
                            <Typography style={{ fontSize: '25px', textAlign: 'center', marginRight: '10px' }} color='azure'>Tile Width: {project.tileWidth}</Typography>
                        </Grid>

                        <Stack direction='row'>
                            <Button onClick={handleCloseExportTileset} sx={{ fontSize: '20px', marginLeft: '25%', marginRight: '50px' }}>
                                <Typography>Cancel</Typography>
                                <Clear />
                            </Button>
                            <Button onClick={handleExportTileset} >
                                <Typography >Download</Typography>
                                <Check />
                            </Button>
                        </Stack>

                    </Stack>
                </Box>
            </Modal>

            <Modal
                open={showExportError}
                onClose={handleCloseExportError}
            >
                <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
                    <Stack direction='column' style={{ margin: '10px' }}>
                        <Typography style={{ textAlign: 'center', marginBottom: '10px' }} variant='h5' color='#2dd4cf'>Warning</Typography>
                        <Typography style={{ textAlign: 'center' }} color='azure'>Cannot Export Tileset with empty tiles!</Typography>
                    </Stack>
                </Box>
            </Modal>


        </Box>
    )
}
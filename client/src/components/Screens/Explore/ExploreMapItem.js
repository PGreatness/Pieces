import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Modal, Grid, Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
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


export default function ExploreMapItem(props) {
    const navigate = useNavigate();
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const project = props.project;

    const [showRequestModal, setShowRequestModal] = useState(false);
    const [mapOwner, setMapOwner] = useState(null);

    const [likes, setLikes] = useState(project.likes.length);
    const [dislikes, setDislikes] = useState(project.dislikes.length);
    const [isLiked, setIsLiked] = useState(project.likes.includes(auth.user?._id));
    const [isDisliked, setIsDisliked] = useState(project.dislikes.includes(auth.user?._id));
    const [isFav, setIsFav] = useState(project.favs.includes(auth.user?._id));
    const [isUnlocked, setIsUnlocked] = useState(project.collaboratorIds.includes(auth.user?._id) || project.ownerId == auth.user?._id)


    useEffect(() => {
        setLikes(project.likes.length);
        setDislikes(project.dislikes.length);
        setIsLiked(project.likes.includes(auth.user?._id));
        setIsDisliked(project.dislikes.includes(auth.user?._id));
        setIsFav(project.favs.includes(auth.user?._id));
        setIsUnlocked(project.collaboratorIds.includes(auth.user?._id) || project.ownerId == auth.user?._id)
    }, []);


    const handleLikeClick = (event) => {
        event.stopPropagation();
        store.updateMapLikes(project._id, (like_arr, dislike_arr) => {
            setLikes(like_arr.length);
            setDislikes(dislike_arr.length);
            setIsLiked(like_arr.includes(auth.user?._id));
            setIsDisliked(dislike_arr.includes(auth.user?._id));
        });
    }

    const handleDislikeClick = (event) => {
        event.stopPropagation();
        store.updateMapDislikes(project._id, (like_arr, dislike_arr) => {
            setLikes(like_arr.length);
            setDislikes(dislike_arr.length);
            setIsLiked(like_arr.includes(auth.user?._id));
            setIsDisliked(dislike_arr.includes(auth.user?._id));
        });
    }

    const handleFavClick = (event) => {
        event.stopPropagation();
        store.updateMapFav(project._id, (fav_arr) => {
            setIsFav(fav_arr.includes(auth.user?._id));
        });
    }

    const setLocation = (loc) => {
        props.setLoc(loc);
        navigate(loc);
    }

    const handleConfirmRequest = () => {
        auth.getUserById(project.ownerId, (ownerUser) => {
            setMapOwner(ownerUser);
        });
        setShowRequestModal(true)
    }

    const handleCloseAccessRequest = () => {
        setShowRequestModal(false)
    }

    const handleRequestAccess = () => {
        store.editMapRequest(mapOwner._id, project._id, project.title)
        setShowRequestModal(false)
    }

    const handleComments = () => {
        props.setShowComments()
        props.setProjectId(project._id)
        console.log(props.projectId)
    }

    const handlePreviewClick = () => {
        // if (isUnlocked) {
        //     setLocation('/view/map/' + project._id);
        // } else {
        //     handleConfirmRequest();
        // }
        setLocation('/view/map/' + project._id);
    }

    return (
        <Box sx={{ boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius: "16px" }}
            style={{ marginBottom: "40px", width: '98%', height: '78%', position: 'relative' }}>
            <img class='image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px" onClick={handlePreviewClick}></img>
            {isUnlocked ?
                <LockOpenIcon className='lock_icon'></LockOpenIcon> :
                <LockIcon className='lock_icon'></LockIcon>
            }
            <div class="overlay">
                <Box style={{ display: 'flex', flexDirection: 'row' }} >
                    <Box style={{ width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} >
                        <div class="project_title">{project.title}</div>
                        <div class="project_desc">{project.mapDescription}</div>
                    </Box>
                    <Box style={{ width: '40%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'end', flexDirection: 'row' }} >
                        <Box style={{ display: 'flex', flexDirection: 'column' }}>
                            <ThumbUpIcon sx={{ fontSize: 50, px: 1, pt: 1, color: `${isLiked ? "#2dd4cf" : "white"}` }}
                                onClick={handleLikeClick} ></ThumbUpIcon>
                            <div class="like_num">{likes}</div>
                        </Box>

                        <Box style={{ display: 'flex', flexDirection: 'column' }}>
                            <ThumbDownIcon sx={{ fontSize: 50, px: 2, pt: 1, color: `${isDisliked ? "#2dd4cf" : "white"}` }}
                                onClick={handleDislikeClick} ></ThumbDownIcon>
                            <div class="like_num">{dislikes}</div>
                        </Box>

                        <CommentIcon sx={{ fontSize: 50, px: 1 }} onClick={handleComments}></CommentIcon>
                        <DownloadIcon sx={{ fontSize: 50, px: 1 }}></DownloadIcon>
                        <FavoriteIcon sx={{ fontSize: 50, px: 1, color: `${isFav ? "#2dd4cf" : "white"}` }}
                            onClick={handleFavClick}></FavoriteIcon>
                        <EditIcon sx={{ fontSize: 50, color: `${isUnlocked ? "white" : "gray"}` }}
                            onClick={isUnlocked ? () => {
                                store.loadMap(project._id).then(() => {
                                    setLocation('/map/' + project._id);
                                    auth.socket.emit('openProject', { project: project._id })
                                })
                            } : handleConfirmRequest} ></EditIcon>
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
                            <Typography style={{ textAlign: 'center', marginBottom: '50px' }} variant='h3' color='azure'>Request Access to Edit Map</Typography>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0px' }} item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '0px', marginRight: '10px', fontSize: '30px' }} color='azure'>Map Name:</Typography>
                            <Typography style={{ textAlign: 'center', marginBottom: '0px', marginRight: '10px', fontSize: '30px' }} color='azure'>{project.title}</Typography>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }} item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px', marginRight: '10px', fontSize: '20px' }} color='azure'>Current Collaborators:</Typography>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px', marginRight: '10px', fontSize: '20px' }} color='azure'>{project.collaboratorIds.length + 1}</Typography>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0px' }} item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '0px', marginRight: '10px', fontSize: '30px' }} color='azure'>Map Owner:</Typography>
                            <Typography style={{ textAlign: 'center', marginBottom: '0px', marginRight: '10px', fontSize: '30px' }} color='azure'>{mapOwner?.firstName} {mapOwner?.lastName}</Typography>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '50px' }} item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px', marginRight: '10px', fontSize: '20px' }} color='azure'>Username:</Typography>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px', marginRight: '10px', fontSize: '20px' }} color='azure'>@{mapOwner?.userName}</Typography>
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

        </Box>
    )
}
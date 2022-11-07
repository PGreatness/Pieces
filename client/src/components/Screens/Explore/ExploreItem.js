import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
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


export default function ExploreItem(props) {
    const navigate = useNavigate();
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const project = props.project;
    console.log(project)
    console.log(auth.user)

    // store.getUserById(project.ownerId)
    // const mapOwner = store.mapOwner;
    // console.log(mapOwner.userName)


    const [likes, setLikes] = useState(project.likes.length); 
    const [dislikes, setDislikes] = useState(project.dislikes.length);  
    const [isLiked, setIsLiked] = useState(project.likes.includes(auth.user?._id));
    const [isDisliked, setIsDisliked] = useState(project.dislikes.includes(auth.user?._id));
    const [isFav, setIsFav] = useState(project.favs.includes(auth.user?._id));
    const [isCollaborator, setIsCollaborator] = useState(project.collaboratorIds.includes(auth.user?._id));


    const handleLikeClick = (event) => {
        console.log('clicked')
        event.stopPropagation();
        store.updateLikes(project._id, (like_arr, dislike_arr) => {
            setLikes(like_arr.length);
            setDislikes(dislike_arr.length);
            setIsLiked(like_arr.includes(auth.user?.userName));
            setIsDisliked(dislike_arr.includes(auth.user?.userName));
        });
    }

    const setLocation = (loc) => {
        console.log('here here')
        props.setLoc(loc);
        navigate(loc);
    }

    const showRequestModal = () => {
    }

    return (
        <Box sx={{ boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius: "16px" }}
            style={{ marginBottom: "40px", width: '98%', height: '78%', position: 'relative' }}>
            <img class='image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
            {isCollaborator? 
            <LockOpenIcon className='lock_icon'></LockOpenIcon> :
            <LockIcon className='lock_icon'></LockIcon>
            }
            <div class="overlay">
                <Box style={{ display: 'flex', flexDirection: 'row' }} >
                    <Box style={{ width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} >
                        <div class="project_title">{project.mapName}</div>
                        <div class="project_username">by @</div>
                    </Box>
                    <Box style={{ width: '40%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'end', flexDirection: 'row' }} >
                        <Box style={{ display: 'flex', flexDirection: 'column' }}>
                            <ThumbUpIcon sx={{ fontSize: 50, px: 1, pt: 1, color:`${isLiked ? "#2dd4cf" : "white"}` }}
                            onClick={handleLikeClick} ></ThumbUpIcon>
                            <div class="like_num">{likes}</div>
                        </Box>

                        <Box style={{ display: 'flex', flexDirection: 'column' }}>
                            <ThumbDownIcon sx={{ fontSize: 50, px: 2, pt: 1, color:`${isDisliked ? "#2dd4cf" : "white"}` }}
                            onClick={() => handleLikeClick} 
                            ></ThumbDownIcon>
                            <div class="like_num">{dislikes}</div>
                        </Box>

                        <CommentIcon sx={{ fontSize: 50, px: 1 }} onClick={props.setShowComments}></CommentIcon>
                        <DownloadIcon sx={{ fontSize: 50, px: 1 }}></DownloadIcon>
                        <FavoriteIcon sx={{ fontSize: 50, px: 1, color:`${isFav ? "#2dd4cf" : "white"}` }}></FavoriteIcon>
                        <EditIcon sx={{ fontSize: 50, color:`${isCollaborator? "white" : "gray"}`}}
                        onClick={isCollaborator? () => setLocation('/map/1') : () => showRequestModal} ></EditIcon>
                    </Box>
                </Box>
            </div>
        </Box>
    )
}
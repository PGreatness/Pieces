import * as React from 'react';
import Box from '@mui/material/Box';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import SendIcon from '@mui/icons-material/Send';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import img from '../../images/map.jpg'
import './css/explore.css';
import { useContext, useEffect, useState } from 'react';
import { GlobalStoreContext } from '../../../store/store'
import AuthContext from '../../../auth/auth';

export default function ExploreCommentsItem(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const comment = props.comment;
    console.log("Am I making it here?")
    console.log(comment)

    const [likes, setLikes] = useState(comment.likes.length); 
    const [dislikes, setDislikes] = useState(comment.dislikes.length);
    const [isLiked, setIsLiked] = useState(comment.likes.includes(auth.user?._id));
    const [isDisliked, setIsDisliked] = useState(comment.dislikes.includes(auth.user?._id));

    useEffect(() => {
        setLikes(comment.likes.length);
        setDislikes(comment.dislikes.length);
        setIsLiked(comment.likes.includes(auth.user?._id));
        setIsDisliked(comment.dislikes.includes(auth.user?._id));
    },[]);


    const handleLikeClick = (event) => {
        console.log("hello");
        event.stopPropagation();
        store.updateCommentLikes(comment._id, (like_arr, dislike_arr) => {
            setLikes(like_arr.length);
            setDislikes(dislike_arr.length);
            setIsLiked(like_arr.includes(auth.user?.userName));
            setIsDisliked(dislike_arr.includes(auth.user?.userName));
        });
    }

    return (
        <ListItem style={{
            display: 'flex', flexDirection: 'column', width: "100%", marginBottom: "10px",
            backgroundColor: "rgb(217, 217, 217, 0.1)", borderRadius: '30px'
        }}>

            <ListItem style={{ display: 'flex', flexDirection: 'row', paddingTop: '0px', paddingBottom: '0px' }}>
                <ListItemAvatar >
                    <Avatar sx={{ height: '80px', width: '80px' }} src={props.profilePic} />
                </ListItemAvatar>

                <ListItem style={{ display: 'flex', flexDirection: 'column' }}>
                    <ListItem sx={{ fontSize: "40px", fontWeight: 'bolder', paddingBottom: '0px' }} >{comment.userId}</ListItem>
                    <ListItem sx={{ fontSize: "20px", paddingTop: '0px' }}>@{comment.userId}</ListItem>
                </ListItem>

                <ListItem style={{ display: 'flex', flexDirection: 'row', justifyContent:'flex-end', paddingTop: "0px"}}>
                    <div style={{ fontSize: "20px", marginRight: "15px"}}>{comment.dateCreated}</div>
                    <ListItem style={{ display: 'flex', flexDirection: 'column', width: 'auto', padding: "0px"}}>
                        <ThumbUpIcon sx={{ fontSize: 25, px: 1, pt: 1 }} onClick={handleLikeClick}></ThumbUpIcon>
                        <div>{likes}</div>
                    </ListItem>
                    <ListItem style={{ display: 'flex', flexDirection: 'column', width: 'auto', padding: "0px"}}>
                        <ThumbDownIcon sx={{ fontSize: 25, px: 1, pt: 1 }}></ThumbDownIcon>
                        <div>{dislikes}</div>
                    </ListItem>
                </ListItem>

            </ListItem>

            <ListItem style={{ paddingTop: "0px"}}>
                <ListItem sx={{ fontSize: "20px", px: 1}}>
                    {comment.text}
                </ListItem>
            </ListItem>

        </ListItem>
    )
}
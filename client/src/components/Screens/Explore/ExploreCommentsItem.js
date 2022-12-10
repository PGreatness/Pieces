import * as React from 'react';
import Box from '@mui/material/Box';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import DeleteIcon from '@mui/icons-material/Delete';
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
//import './css/explore.css';
import { useContext, useEffect, useState } from 'react';
import { GlobalStoreContext } from '../../../store/store'
import api from '../../../api/api';
import AuthContext from '../../../auth/auth';

export default function ExploreCommentsItem(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    //const comment = props.comment;
    const [comment, setComment] = useState('');
    const [likes, setLikes] = useState(null);
    const [dislikes, setDislikes] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [commentOwner, setCommentOwner] = useState(null);


    useEffect(() => {
        auth.getUserById(props.comment.userId, (ownerUser) => {
            setCommentOwner(ownerUser);
        }).then(() => {
            console.log('useEffect2')
            setComment(props.comment)
            setLikes(props.comment.likes.length);
            setDislikes(props.comment.dislikes.length);
            setIsLiked(props.comment.likes.includes(auth.user?._id));
            setIsDisliked(props.comment.dislikes.includes(auth.user?._id));
        })

    }, [props.comment]);


    const handleLikeClick = (event) => {
        // console.log("hello");
        event.stopPropagation();
        store.updateCommentLikes(comment._id, (like_arr, dislike_arr, comment) => {
            console.log('wtf')
            setLikes(like_arr.length);
            setDislikes(dislike_arr.length);
            setIsLiked(like_arr.includes(auth.user?._id));
            setIsDisliked(dislike_arr.includes(auth.user?._id));
            setComment(comment)
        });
    }

    const handleDislikeClick = (event) => {
        event.stopPropagation();
        store.updateCommentDislikes(comment._id, (like_arr, dislike_arr, comment) => {
            setLikes(like_arr.length);
            setDislikes(dislike_arr.length);
            setIsLiked(like_arr.includes(auth.user?._id));
            setIsDisliked(dislike_arr.includes(auth.user?._id));
            setComment(comment)
        });
    }

    const handleDeleteComment = () => {
        props.deleteComment(comment._id)
    }

    let options = {
        weekday: "short", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit",
        timeZone: "EST",
    };
    var displayDate = new Date(comment.createdAt).toLocaleString("en-US", options);

    return (
        <ListItem style={{
            display: 'flex', flexDirection: 'column', width: "100%", marginBottom: "10px",
            backgroundColor: "rgb(217, 217, 217, 0.1)", borderRadius: '30px'
        }}>

            <ListItem style={{ display: 'flex', flexDirection: 'row', marginTop: '10px', paddingBottom: '0px' }}>
                <ListItemAvatar >
                    <Avatar src={commentOwner?.profilePic?.url}
                        sx={{
                            width: 80,
                            height: 80,
                            fontSize: "20px",
                            bgcolor: "rgb(2, 0, 36)",
                            border: "rgba(59, 130, 206, 1) 2px solid"
                        }}>
                        {commentOwner?.firstName.charAt(0)}{commentOwner?.lastName.charAt(0)}
                    </Avatar>
                </ListItemAvatar>

                <ListItem style={{ display: 'flex', flexDirection: 'column' }}>
                    <ListItem sx={{ fontSize: "40px", fontWeight: 'bolder', paddingBottom: '0px' }} >{commentOwner ? commentOwner.firstName : ""} {commentOwner ? commentOwner.lastName : ""}</ListItem>
                    <ListItem sx={{ fontSize: "20px", paddingTop: '0px' }}>@{commentOwner?.userName}</ListItem>
                </ListItem>

                <ListItem style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingTop: "0px" }}>
                    <ListItem style={{ display: 'flex', flexDirection: 'column', width: 'auto', padding: "0px" }}>
                        <ThumbUpIcon sx={{ fontSize: 25, px: 1, pt: 1, color: `${isLiked ? "#2dd4cf" : "white"}` }} onClick={handleLikeClick}></ThumbUpIcon>
                        <div>{likes}</div>
                    </ListItem>
                    <ListItem style={{ display: 'flex', flexDirection: 'column', width: 'auto', padding: "0px" }}>
                        <ThumbDownIcon sx={{ fontSize: 25, px: 1, pt: 1, color: `${isDisliked ? "#2dd4cf" : "white"}` }} onClick={handleDislikeClick}></ThumbDownIcon>
                        <div>{dislikes}</div>
                    </ListItem>
                    {auth.user?._id == comment.userId ?
                        <ListItem style={{ display: 'flex', flexDirection: 'column', width: 'auto', padding: "0px" }}>
                            <DeleteIcon sx={{ fontSize: 30, px: 1, marginTop: '-10px', color: '#D0342C' }} onClick={handleDeleteComment}/>
                        </ListItem> : <></>
                    }
                </ListItem>

            </ListItem>

            <ListItem style={{ paddingTop: "10px", paddingLeft: '30px', display: 'flex', flexDirection: 'column', }}>
                <ListItem sx={{ fontSize: "30px", px: 1 }}>
                    {comment.text}
                </ListItem>
                <ListItem >
                    <div style={{ fontSize: "16px", marginLeft: '80%', marginTop: '-15px' }}>{displayDate}</div>
                </ListItem>
            </ListItem>

        </ListItem>
    )
}
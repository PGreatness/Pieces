import * as React from 'react';
import Box from '@mui/material/Box';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import LockOpenIcon from '@mui/icons-material/LockOpen';
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
import ExploreCommentsItem from './ExploreCommentsItem'
import AuthContext from '../../../auth/auth';
import { Modal, Grid, Button, Typography } from '@mui/material';

export default function ExploreComments(props) {
    // console.log("hello");
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [comments, setComments] = useState(props.comments);
    const [owner, setOwner] = useState(props.owner);
    const [isLiked, setIsLiked] = useState(props.commentsProject.likes.includes(auth.user?._id));
    const [isDisliked, setIsDisliked] = useState(props.commentsProject.dislikes.includes(auth.user?._id));
    const [isFav, setIsFav] = useState(props.commentsProject.favs.includes(auth.user?._id));
    const [isUnlocked, setIsUnlocked] = useState(props.commentsProject.collaboratorIds.includes(auth.user?._id) || props.commentsProject.ownerId == auth.user?._id)


    //useEffect(() => { setComments(store.projectComments) }, [store.projectComments]);
    console.log('comments page')


    const handleCreateNewComment = async () => {
        let text = document.getElementById('reply_field').value
        let time = Date();
        // let ownerId = '636942dd04afd5d5f9331583'
        let ownerId = auth.user?._id
        let projectId = props.commentsProject._id

        if (text === "") {
            console.log("Empty text field.")
        }
        else {
            let response = await store.createNewComment(projectId, ownerId, text)
            console.log(response)

            let comments = await store.getProjectComments(projectId)
            setComments(comments)
            document.getElementById('reply_field').value = "";
        }
    }


    const deleteComment = async (commentId) => {
        let comments = await store.deleteComment(commentId, props.commentsProject._id)
        console.log(comments)
        setComments(comments)
        //return 
    }

    return (
        <Box style={{
            width: '100%', display: 'flex', alignItems: 'flex-start',
            flexDirection: 'column', paddingLeft: '40px', paddingRight: '40px', position: 'relative'
        }}>

            <Box style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '10%', alignItems: 'center' }}>
                <KeyboardBackspaceIcon className="back_icon" onClick={props.setShowComments}></KeyboardBackspaceIcon>
                <div className="comment_title">Comments</div>
            </Box>

            <Box style={{
                display: 'flex', flexDirection: 'column',
                width: '100%', height: '90%'
            }}>

                <Box style={{
                    display: 'flex', width: '100%', height: '40%',
                    marginBottom: "18px"
                }}>
                    <Box sx={{ boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius: "16px" }} style={{
                        width: '100%',
                        height: '100%', position: 'relative', backgroundImage: `url(${img})`
                    }}>
                        {isUnlocked ?
                            <LockOpenIcon className='lock_icon'></LockOpenIcon> :
                            <LockIcon className='lock_icon'></LockIcon>
                        }
                        <div class="overlay_comments">
                            <Box style={{ display: 'flex', flexDirection: 'row', maxHeight: '100%' }} >
                                <Box style={{ width: '50%', display: 'flex', flexDirection: 'column' }} >
                                    <Typography style={{ marginLeft: '20px', fontSize: '35px', fontWeight: '500' }} color='azure'>{props.commentsProject.title}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ListItemAvatar >
                                            <Avatar src={owner?.profilePic?.url}
                                                sx={{
                                                    width: 25,
                                                    height: 25,
                                                    fontSize: "20px",
                                                    bgcolor: "rgb(2, 0, 36)",
                                                    border: "rgba(59, 130, 206, 1) 2px solid",
                                                    marginLeft: '20px',
                                                }}>
                                                {owner?.firstName.charAt(0)}{owner?.lastName.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <Typography style={{ marginLeft: '0px', fontSize: '20px', fontWeight: '300' }} color='azure'>
                                            @{owner.userName}
                                        </Typography>
                                    </Box>

                                </Box>
                                <Box style={{ width: '50%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'end', flexDirection: 'row' }} >
                                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                        <ThumbUpIcon sx={{ fontSize: 40, px: 1, pt: 2, color: `${isLiked ? "#2dd4cf" : "white"}` }}></ThumbUpIcon>
                                        <div class="like_num">{props.commentsProject.likes.length}</div>
                                    </Box>

                                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                        <ThumbDownIcon sx={{ fontSize: 40, px: 2, pt: 2, color: `${isDisliked ? "#2dd4cf" : "white"}` }}></ThumbDownIcon>
                                        <div class="like_num">{props.commentsProject.dislikes.length}</div>
                                    </Box>

                                    <FavoriteIcon sx={{ fontSize: 40, px: 1, color: `${isFav ? "#2dd4cf" : "white"}` }}></FavoriteIcon>

                                </Box>
                            </Box>
                        </div>
                    </Box>


                </Box>


                <Box style={{ display: 'flex', width: '100%', height: '55%', overflow: 'auto', marginBottom: "10px" }}>
                    <List style={{ display: 'flex', flexDirection: 'column', width: "100%", backgroundColor: 'transparent' }}>

                        {console.log(comments)}

                        {comments.map((entry) => {

                            console.log(entry)

                            return <ExploreCommentsItem
                                comment={entry}
                                deleteComment={deleteComment}
                            />
                        })}
                    </List>
                </Box>


                <Box style={{
                    display: 'flex',
                    width: '100%',
                    height: '12%',
                    marginBottom: '20px',
                    flexDirection: 'row',
                    borderBottomLeftRadius: '15px',
                    borderBottomRightRadius: '15px',
                    backgroundColor: 'rgb(116, 117, 118, 0.4)',
                    alignItems: 'center'
                }}>
                    <input id="reply_field" placeholder="Add a reply..." ></input>
                    <SendIcon sx={{ fontSize: 70, px: 1, paddingRight: '30px' }} onClick={handleCreateNewComment}></SendIcon>

                </Box>
            </Box>


        </Box>
    )
}
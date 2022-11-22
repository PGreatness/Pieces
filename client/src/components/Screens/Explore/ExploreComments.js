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
import ExploreCommentsItem from './ExploreCommentsItem'
import AuthContext from '../../../auth/auth';

export default function ExploreComments(props) {
    // console.log("hello");
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [comments, setComments] = useState(store.projectComments);

    let test = props.loadStore;
    console.log(comments)

    useEffect(() => {setComments(store.projectComments)}, [store.projectComments]);

    const handleCreateNewComment = async () => {
        let text = document.getElementById('reply_field').value
        let time = Date();
        // let ownerId = '636942dd04afd5d5f9331583'
        let ownerId = auth.user?._id
        let projectId = props.projectId

        if (text === "") {
            console.log("Empty text field.")
        }
        else {
            let response = await store.createNewComment(projectId, ownerId, text)
            console.log(response)
            document.getElementById('reply_field').value = "";
        }
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
                        <LockIcon className='lock_icon'></LockIcon>
                        <div class="overlay_comments">
                            <Box style={{ display: 'flex', flexDirection: 'row', maxHeight: '100%' }} >
                                <Box style={{ width: '50%', display: 'flex', flexDirection: 'column' }} >
                                    <div class="project_title_comments">Planet Midget</div>
                                    <div class="project_username">by @tomJackson16</div>
                                </Box>
                                <Box style={{ width: '50%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'end', flexDirection: 'row' }} >
                                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                        <ThumbUpIcon sx={{ fontSize: 40, px: 1, pt: 1 }}></ThumbUpIcon>
                                        <div class="like_num">352</div>
                                    </Box>

                                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                        <ThumbDownIcon sx={{ fontSize: 40, px: 2, pt: 1 }}></ThumbDownIcon>
                                        <div class="like_num">7</div>
                                    </Box>

                                    <CommentIcon sx={{ fontSize: 40, px: 1, color: '#0e74a0' }}></CommentIcon>
                                    <DownloadIcon sx={{ fontSize: 40, px: 1 }}></DownloadIcon>
                                    <FavoriteIcon sx={{ fontSize: 40, px: 1 }}></FavoriteIcon>
                                    <EditIcon sx={{ fontSize: 40, color: 'gray' }}></EditIcon>
                                </Box>
                            </Box>
                        </div>
                    </Box>


                </Box>


                <Box style={{ display: 'flex', width: '100%', height: '55%', overflow: 'auto', marginBottom: "10px" }}>
                    <List style={{ display: 'flex', flexDirection: 'column', width: "100%" }}>


                        {comments.map((entry) => 
                            entry.projectId == props.projectId ?
                            <ExploreCommentsItem
                                comment={entry}
                            />:<></>)
                        }
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
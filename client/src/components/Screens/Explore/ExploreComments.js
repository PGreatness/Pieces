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
import TextField from "@mui/material/TextField"
import img from './images/map.jpg'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import './css/explore.css';

export default function ExploreComments(props) {
    return (
        <Box style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', width: '75%' }}>

            <Box style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '10%', alignItems: 'center' }}>
                <KeyboardBackspaceIcon className="back_icon" onClick={props.setShowComments}></KeyboardBackspaceIcon>
                <div className="comment_title">Comments</div>
            </Box>




            <Box style={{
                display: 'flex', flexDirection: 'column',
                width: '100%', height: '90%'
            }}>

                <Box style={{
                    display: 'flex', width: '100%', height: '30%',
                    marginBottom: "30px"
                }}>
                    <Box sx={{ boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius: "16px" }} style={{width: '100%', 
                    height: '100%', position: 'relative', backgroundImage: `url(${img})` }}>
                        <LockIcon className='lock_icon'></LockIcon>
                        <div class="overlay_comments">
                            <Box style={{ display: 'flex', flexDirection: 'row' }} >
                                <Box style={{ width: '50%', display: 'flex', flexDirection: 'column' }} >
                                    <div class="project_title">Planet Midget</div>
                                    <div class="project_username">by @tomJackson16</div>
                                </Box>
                                <Box style={{ width: '50%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'end', flexDirection: 'row' }} >
                                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                        <ThumbUpIcon sx={{ fontSize: 50, px: 1, pt: 1 }}></ThumbUpIcon>
                                        <div class="like_num">352</div>
                                    </Box>

                                    <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                        <ThumbDownIcon sx={{ fontSize: 50, px: 2, pt: 1 }}></ThumbDownIcon>
                                        <div class="like_num">7</div>
                                    </Box>

                                    <CommentIcon sx={{ fontSize: 50, px: 1, color: '#0e74a0' }}></CommentIcon>
                                    <DownloadIcon sx={{ fontSize: 50, px: 1 }}></DownloadIcon>
                                    <FavoriteIcon sx={{ fontSize: 50, px: 1 }}></FavoriteIcon>
                                    <EditIcon sx={{ fontSize: 50, color: 'gray' }}></EditIcon>
                                </Box>
                            </Box>
                        </div>
                    </Box>


                </Box>


                <Box style={{
                    display: 'flex', width: '100%', height: '55%', overflow: 'auto'
                }}>

                </Box>


                <Box style={{
                    display: 'flex',
                    width: '100%',
                    height: '12%',
                    marginBottom: '20px',
                    flexDirection: 'row',
                    borderRadius: '15px',
                    backgroundColor: 'rgb(116, 117, 118, 0.4)',
                    alignItems: 'center',
                    padding: '10px'
                }}>
                    <input id="reply_field" placeholder="Add a reply..." ></input>
                    <SendIcon sx={{ fontSize: 70, px: 1}}></SendIcon>
                    
                </Box>
            </Box>


        </Box>
    )
}
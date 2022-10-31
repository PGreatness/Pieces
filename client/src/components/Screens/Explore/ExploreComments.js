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
import img from './images/map.jpg'
import './css/explore.css';

export default function ExploreComments(props) {
    return (
        <Box style={{ width: '100%', display: 'flex', alignItems: 'flex-start', 
            flexDirection: 'column', paddingLeft: '40px', paddingRight: '40px', position: 'relative' }}>

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
                    <List style={{ display: 'flex', flexDirection: 'column', width: "100%"}}>


                        <ListItem style={{
                            display: 'flex', flexDirection: 'column', width: "100%", marginBottom: "10px",
                            backgroundColor: "rgb(217, 217, 217, 0.1)", borderRadius: '30px'
                        }}>

                            <ListItem style={{ display: 'flex', flexDirection: 'row', paddingTop: '0px', paddingBottom: '0px' }}>
                                <ListItemAvatar >
                                    <Avatar sx={{ height: '80px', width: '80px' }} src={props.profilePic} />
                                </ListItemAvatar>

                                <ListItem style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ListItem sx={{ fontSize: "40px", fontWeight: 'bolder', paddingBottom: '0px' }} >Mitchel Lockwood</ListItem>
                                    <ListItem sx={{ fontSize: "20px", paddingTop: '0px' }}>@mitchL4</ListItem>
                                </ListItem>

                                <ListItem style={{ display: 'flex', flexDirection: 'row', justifyContent:'flex-end', paddingTop: "0px"}}>
                                    <div style={{ fontSize: "20px", marginRight: "15px"}}>10d</div>
                                    <ListItem style={{ display: 'flex', flexDirection: 'column', width: 'auto', padding: "0px"}}>
                                        <ThumbUpIcon sx={{ fontSize: 25, px: 1, pt: 1 }}></ThumbUpIcon>
                                        <div>30</div>
                                    </ListItem>
                                    <ListItem style={{ display: 'flex', flexDirection: 'column', width: 'auto', padding: "0px"}}>
                                        <ThumbDownIcon sx={{ fontSize: 25, px: 1, pt: 1 }}></ThumbDownIcon>
                                        <div>4</div>
                                    </ListItem>
                                </ListItem>

                            </ListItem>

                            <ListItem style={{ paddingTop: "0px"}}>
                                <ListItem sx={{ fontSize: "20px", px: 1}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                                Aliquam in hendrerit urna.  Pellentesque commodo lacus at sodales sodales.
                                Quisque sagittis orci ut diam condimentum, vel euismod erat placerat.
                                    Pellentesque sit amet sapien fringilla, mattis ligula magna...</ListItem>
                            </ListItem>

                        </ListItem>





                        <ListItem style={{
                            display: 'flex', flexDirection: 'column', width: "100%", marginBottom: "10px",
                            backgroundColor: "rgb(217, 217, 217, 0.1)", borderRadius: '30px'
                        }}>

                            <ListItem style={{ display: 'flex', flexDirection: 'row', paddingTop: '0px', paddingBottom: '0px' }}>
                                
                                <ListItemAvatar >
                                    <Avatar sx={{ height: '80px', width: '80px' }} src={props.profilePic} />
                                </ListItemAvatar>

                                <ListItem style={{ display: 'flex', flexDirection: 'column' }}>
                                <ListItem sx={{ fontSize: "40px", fontWeight: 'bolder', paddingBottom: '0px' }} >Patricia Miller</ListItem>
                                    <ListItem sx={{ fontSize: "20px", paddingTop: '0px' }}>@patmiller99</ListItem>
                                </ListItem>

                                <ListItem style={{ display: 'flex', flexDirection: 'row', justifyContent:'flex-end', paddingTop: "0px"}}>
                                    <div style={{ fontSize: "20px", marginRight: "15px"}}>10d</div>
                                    <ListItem style={{ display: 'flex', flexDirection: 'column', width: 'auto', padding: "0px"}}>
                                        <ThumbUpIcon sx={{ fontSize: 25, px: 1, pt: 1 }}></ThumbUpIcon>
                                        <div>30</div>
                                    </ListItem>
                                    <ListItem style={{ display: 'flex', flexDirection: 'column', width: 'auto', padding: "0px"}}>
                                        <ThumbDownIcon sx={{ fontSize: 25, px: 1, pt: 1 }}></ThumbDownIcon>
                                        <div>4</div>
                                    </ListItem>
                                </ListItem>

                            </ListItem>

                            <ListItem style={{ paddingTop: "0px"}}>
                                <ListItemText sx={{ px: 1 }}>Pellentesque commodo lacus at sodales sodales.
                                Quisque sagittis orci ut diam condimentum, Pellentesque muster sit amet sapien fringilla,
                                 mattis ligula...</ListItemText>
                            </ListItem>

                        </ListItem>





                        <ListItem style={{
                            display: 'flex', flexDirection: 'column', width: "100%", marginBottom: "10px",
                            backgroundColor: "rgb(217, 217, 217, 0.1)", borderRadius: '30px'
                        }}>

                            <ListItem style={{ display: 'flex', flexDirection: 'row', paddingTop: '0px', paddingBottom: '0px' }}>
                                
                                <ListItemAvatar >
                                    <Avatar sx={{ height: '80px', width: '80px' }} src={props.profilePic} />
                                </ListItemAvatar>

                                <ListItem style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ListItem sx={{ fontSize: "40px", fontWeight: 'bolder', paddingBottom: '0px' }} >David Hart</ListItem>
                                    <ListItem sx={{ fontSize: "20px", paddingTop: '0px' }}>@penguin4</ListItem>
                                </ListItem>

                                <ListItem style={{ display: 'flex', flexDirection: 'row', justifyContent:'flex-end', paddingTop: "0px"}}>
                                    <div style={{ fontSize: "20px", marginRight: "15px"}}>10d</div>
                                    <ListItem style={{ display: 'flex', flexDirection: 'column', width: 'auto', padding: "0px"}}>
                                        <ThumbUpIcon sx={{ fontSize: 25, px: 1, pt: 1 }}></ThumbUpIcon>
                                        <div>30</div>
                                    </ListItem>
                                    <ListItem style={{ display: 'flex', flexDirection: 'column', width: 'auto', padding: "0px"}}>
                                        <ThumbDownIcon sx={{ fontSize: 25, px: 1, pt: 1 }}></ThumbDownIcon>
                                        <div>4</div>
                                    </ListItem>
                                </ListItem>

                            </ListItem>

                            <ListItem style={{ paddingTop: "0px"}}>
                                <ListItemText sx={{ px: 1}}>Tis ligula lacus at sodales sodat magna...</ListItemText>
                            </ListItem>

                        </ListItem>




                        


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
                    <SendIcon sx={{ fontSize: 70, px: 1, paddingRight: '30px' }}></SendIcon>

                </Box>
            </Box>


        </Box>
    )
}
import * as React from 'react';
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';
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
import img from './images/map.jpg'
import './css/explore.css';

export default function Explore(props) {
    const navigate = useNavigate();

    return (
        <Box style={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column', 
        width: '100%', padding: '20px'}}>

            <Box>
                <Button style={{ backgroundColor: "#333135", marginLeft: "30px", marginTop: "10px", marginBottom: "20px" }}>
                    <div className="button_text">Sort by</div>
                    <SortIcon className="button_icons" ></SortIcon>
                </Button>
                <Button style={{ backgroundColor: "#333135", marginLeft: "30px", marginTop: "10px", marginBottom: "20px" }}>
                    <div className="button_text">Filter by</div>
                    <SortIcon className="button_icons" ></SortIcon>
                </Button>
            </Box>

            <Box height="20px"></Box>

            <Box
                style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', 
                    maxHeight: '100%', width: '100%', overflow: 'auto', paddingLeft:'10px', borderRadius: '30px' }}
            >
                <Box sx={{ boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius:"16px" }} 
                style={{marginBottom: "40px", width: '98%', height: '78%', position: 'relative' }}>
                    <img class='image' src={require("./images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                    <LockIcon className='lock_icon'></LockIcon>
                    <div class="overlay">
                        <Box style={{ display: 'flex', flexDirection: 'row' }} >
                            <Box style={{ width:'50%', display: 'flex', flexDirection: 'column', justifyContent:'center' }} >
                                <div class="project_title">Planet Midget</div>
                                <div class="project_username">by @tomJackson16</div>
                            </Box>
                            <Box style={{ width: '50%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent:'end', flexDirection: 'row' }} >
                                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ThumbUpIcon sx={{ fontSize: 50, px: 1, pt: 1 }}></ThumbUpIcon>
                                    <div class="like_num">352</div>
                                </Box>

                                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ThumbDownIcon sx={{ fontSize: 50, px: 2, pt: 1 }}></ThumbDownIcon>
                                    <div class="like_num">7</div>
                                </Box>

                                <CommentIcon sx={{ fontSize: 50, px: 1 }} onClick={props.setShowComments}></CommentIcon>
                                <DownloadIcon sx={{ fontSize: 50, px: 1 }}></DownloadIcon>
                                <FavoriteIcon sx={{ fontSize: 50, px: 1}}></FavoriteIcon>
                                <EditIcon sx={{ fontSize: 50, color: 'gray' }}></EditIcon>
                            </Box>
                        </Box>
                    </div>
                </Box>

                <Box sx={{ boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius:"16px" }} 
                style={{marginBottom: "40px", width: '98%', height: '78%', position: 'relative' }}>
                    <img class='image' src={require("./images/tile.png")} width="100%" height="100%" border-radius="16px"></img>
                    <LockOpenIcon className='lock_icon'></LockOpenIcon>
                    <div class="overlay">
                        <Box style={{ display: 'flex', flexDirection: 'row' }} >
                            <Box style={{ width:'50%', display: 'flex', flexDirection: 'column', justifyContent:'center' }} >
                                <div class="project_title">Minecraft Copy</div>
                                <div class="project_username">by @maximusc888</div>
                            </Box>
                            <Box style={{ width: '50%', padding: '20px', display: 'flex', alignItems: 'center', justifyContent:'end', flexDirection: 'row' }} >
                                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ThumbUpIcon sx={{ fontSize: 50, px: 1, pt: 1 }}></ThumbUpIcon>
                                    <div class="like_num">218</div>
                                </Box>

                                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ThumbDownIcon sx={{ fontSize: 50, px: 2, pt: 1 }}></ThumbDownIcon>
                                    <div class="like_num">3</div>
                                </Box>
                                <CommentIcon sx={{ fontSize: 50, px: 1 }} onClick={props.setShowComments}></CommentIcon>
                                <DownloadIcon sx={{ fontSize: 50, px: 1 }}></DownloadIcon>
                                <FavoriteIcon sx={{ fontSize: 50, px: 1}}></FavoriteIcon>
                                <EditIcon sx={{ fontSize: 50 }} onClick={() => { navigate("/map/:id")}}></EditIcon>
                            </Box>
                        </Box>
                    </div>
                </Box>
            </Box>


        </Box>
    )
}
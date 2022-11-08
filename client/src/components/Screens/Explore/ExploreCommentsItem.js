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
import { useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../../../store/store'

export default function ExploreCommentsItem(props) {
    const { store } = useContext(GlobalStoreContext);
    const comments = props.comments;
    console.log(comments)

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
    )
}
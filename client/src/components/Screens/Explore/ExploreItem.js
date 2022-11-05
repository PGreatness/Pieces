import * as React from 'react';
import Box from '@mui/material/Box';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import './css/explore.css';


export default function ExploreItem(props) {
    // const { store } = useContext(GlobalStoreContext);
    // const { auth } = useContext(AuthContext); 
    // const { item } = props;
    // const [likes, setLikes] = useState(item.likes.length); 
    // const [dislikes, setDislikes] = useState(item.dislikes.length); 
    // const [isLiked, setIsLiked] = useState(item.likes.includes(auth.user?.userName));
    // const [isDisliked, setIsDisliked] = useState(item.dislikes.includes(auth.user?.userName));

    return (
        <Box sx={{ boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius: "16px" }}
            style={{ marginBottom: "40px", width: '98%', height: '78%', position: 'relative' }}>
            <img class='image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
            <LockIcon className='lock_icon'></LockIcon>
            <div class="overlay">
                <Box style={{ display: 'flex', flexDirection: 'row' }} >
                    <Box style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} >
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

                        <CommentIcon sx={{ fontSize: 50, px: 1 }} onClick={props.setShowComments}></CommentIcon>
                        <DownloadIcon sx={{ fontSize: 50, px: 1 }}></DownloadIcon>
                        <FavoriteIcon sx={{ fontSize: 50, px: 1 }}></FavoriteIcon>
                        <EditIcon sx={{ fontSize: 50, color: 'gray' }}></EditIcon>
                    </Box>
                </Box>
            </div>
        </Box>
    )
}
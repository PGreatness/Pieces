import { React, useState, useContext, useEffect } from 'react';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Avatar, ListItemButton, ListItemText, ListItem, Typography, ButtonGroup } from '@mui/material';
import { styled } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import AuthContext from '../../../../auth/auth';
import ReactTimeAgo from 'react-time-ago';

import { CommunityStoreContext } from '../../../../store/communityStore';

const primaryInnerTypographyProps = {
    color:'white',
    float: 'left',
    paddingRight: '1ch',
    fontWeight: 'bold',
    textOverflow: 'ellipsis',
    overflow:'clip',
    maxWidth:'calc(100% - 10vw)',
    whiteSpace: 'nowrap'
}

const secondaryTypographyProps = {
    color: 'whitesmoke',
    float: 'left',
    textOverflow: 'ellipsis',
    overflow:'clip',
    width:'100%',
    whiteSpace: 'nowrap'
}

export default function CommunityMainClickableThread(props) {
    const { communityStore } = useContext(CommunityStoreContext);
    const { auth } = useContext(AuthContext);
    const [username, setUsername] = useState();
    const [avatar, setAvatar] = useState('');
    const [user, setUser] = useState({
        first: '',
        last: '',
        id: '',
    });
    const [interactions, setInteractions] = useState({
        liked: props.thread.likes.includes(auth.user._id),
        disliked: props.thread.dislikes.includes(auth.user._id),
    });

    useEffect(() => {
        console.log("Updating current thread");
        findUserAvatar().then((res) => {
            setUsername(res.username);
            setAvatar(res.userAvatar);
            setUser({
                ...res.user,
            });
        });
    }, [communityStore.TOP_THREADS])

    useEffect(() => {
        setInteractions({
            liked: props.thread.likes.includes(auth.user._id),
            disliked: props.thread.dislikes.includes(auth.user._id),
        })
    }, [props.thread.likes, props.thread.dislikes])

    const LightListItem = styled(ListItem)({
        borderRadius: '10px',
        '&:hover': {
            backgroundColor: '#29313f',
        },
        '&.Mui-selected:hover': {
            backgroundColor: '#29313f',
        },
        backgroundColor: '#455571',
    });
    const findUserAvatar = async () => {
        let userAvatar = '';
        let username = props.thread.senderId;
        let threadOwner = await communityStore.getUserById(username);
        console.log("In findUserAvatar: ");
        console.log(threadOwner);
        userAvatar = (threadOwner.profilePic ? threadOwner.profilePic.url : null) || threadOwner.firstName[0].toUpperCase() + threadOwner.lastName[0].toUpperCase();
        username = threadOwner.userName;
        let user = { first: threadOwner.firstName, last: threadOwner.lastName, id: threadOwner._id };
        return { userAvatar, username, user };
    }

    const registerLike = async () => {
        let threadId = props.thread._id;
        let userId = auth.user._id;
        console.log("In registerLike: ", threadId, userId);
        await communityStore.registerLike(threadId, userId);
    }

    const registerDislike = async () => {
        let threadId = props.thread._id;
        let userId = auth.user._id;
        console.log("In registerDislike: ", threadId, userId);
        await communityStore.registerDislike(threadId, userId);
    }

    const createUpvoteButton = () => {
        return (
            <ListItemButton onClick={registerLike} sx={{ flex: 'revert', padding: '0', paddingRight: '5px' }}>
                <ThumbUpAltIcon className='thread-interaction-buttons' sx={{ color: interactions.liked ? 'rgb(45, 212, 207)' : 'white' }} />
            </ListItemButton>
        );
    }

    const createDownvoteButton = () => {
        return (
            <ListItemButton onClick={registerDislike} sx={{ flex: 'revert', padding: '0' }}>
                <ThumbDownAltIcon className='thread-interaction-buttons' sx={{ color: interactions.disliked ? 'red' : 'white' }} />
            </ListItemButton>
        );
    }

    return (
        <LightListItem alignItems="flex-start" key={"item " + props.thread._id}>
            <ListItemButton onClick={props.selectThread}>
                <ListItemAvatar>
                    <Avatar alt={username}
                    src={avatar}
                    sx={{ width: '50px', height: '50px' }}>
                        {avatar}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={
                <>
                    <Typography
                    sx={ primaryInnerTypographyProps }>
                        {props.thread.threadName}
                    </Typography>

                    <Typography
                    sx={{ color: '#a8a8a8' }}>
                        by: {user.first} {user.last}, <ReactTimeAgo
                                                        date={props.thread.createdAt}
                                                        locale="en-US" timeStyle='twitter-minute-now'/>
                    </Typography>
                </>}
                secondary={props.thread.threadText}
                primaryTypographyProps={{ style: { color: 'white' } }}
                secondaryTypographyProps={{ style: secondaryTypographyProps }} />
            </ListItemButton>

            <ButtonGroup sx={{minWidth: '56px'}}>
                <ListItemText sx={{ flex: 'revert', paddingRight: '5px' }}
                primary={props.thread.likes.length}
                secondary={createUpvoteButton()}
                primaryTypographyProps={{ style: { color: 'white', textAlign: 'center' } }}
                secondaryTypographyProps={{ style: { color: 'whitesmoke' } }} />

                <ListItemText sx={{ flex: 'revert' }}
                primary={props.thread.dislikes.length}
                secondary={createDownvoteButton()}
                primaryTypographyProps={{ style: { color: 'white', textAlign: 'center' } }}
                secondaryTypographyProps={{ style: { color: 'whitesmoke' } }} />
            </ButtonGroup>
        </LightListItem>
    )
}
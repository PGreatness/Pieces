import { React, useState, useContext, useEffect } from 'react';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Avatar, ListItemButton, ListItemText, ListItem, Divider, TextField, InputAdornment, Typography, ButtonGroup } from '@mui/material';
import { styled } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import AuthContext from '../../../../auth/auth';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';

import { CommunityStoreContext } from '../../../../store/communityStore';

const primaryTypographyProps = {
    color: 'white',
    float: 'left',
    paddingRight: '1ch',
    paddingLeft: '2ch',
    textOverflow: 'ellipsis',
    overflow: 'auto',
    maxWidth: '100%'
}

const secondaryTypographyProps = {
    color: 'whitesmoke',
    fontSize: '1em',
    float: 'left',
    paddingLeft: '2ch'
}

export default function CommunityThread(props) {

    const { communityStore } = useContext(CommunityStoreContext);
    const { auth } = useContext(AuthContext);
    const [replyingTo, setReplyingTo] = useState(props.thread._id);
    const [username, setUsername] = useState('');
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

    const [threadreplies, setReplies] = useState([]);

    const getReply = async (replies) => {
        // let replyId = replies;
        // let result = await communityStore.getReplybyId(replyId);
        let results = []
        for(let i = 0; i < replies.length; i++) {
            let result = await communityStore.getReplybyId(replies[i])
            results.push(result)
        }
        return results;
    }

    // communityStore.loadReplies();
    const firstlevelreplies = props.thread.replies;
    console.log(firstlevelreplies);

    useEffect(() => {
        getReply(firstlevelreplies).then((something) => {
            console.log(something)
            setReplies(something)
        })
    }, [communityStore.replies]);

    useEffect(() => {
        findUserAvatar().then((res) => {
            console.log("IN HERE");
            setUsername(res.username);
            setAvatar(res.userAvatar);
            setUser({
                ...res.user,
            });
        });
    }, [communityStore.TOP_THREADS]);

    useEffect(() => {
        setInteractions({
            liked: props.thread.likes.includes(auth.user._id),
            disliked: props.thread.dislikes.includes(auth.user._id),
        })
    }, [props.thread.likes, props.thread.dislikes])

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

    const handleDelete = async () => {
        console.log(auth.user);
        let res = await communityStore.deleteThread(props.thread._id, auth.user._id);
        if (res !== null) {
            console.log('Thread deleted successfully');
            props.deselect();
        }
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

    const createDeleteButton = () => {
        return (
            <ListItemButton onClick={handleDelete} sx={{ flex: 'revert', padding: '0' }}>
                <DeleteIcon className='thread-interaction-buttons delete-button' sx={{ color: 'white' }} />
            </ListItemButton>
        );
    }

    const BetterReplyButton = styled(ListItemButton)({
        // make the button full width
        width: '100%',

    });

    const LightListItem = styled(ListItem)({
        backgroundColor: '#29313f',
        borderRadius: '10px',
        border: '1px solid black',
        width: '100%',
        height: '0%',
        flexDirection: 'column',
        '&:hover': {
            backgroundColor: '#29313f',
        },
        '&.Mui-selected:hover': {
            backgroundColor: '#29313f',
        },
        '& .MuiListItem-root': {
            backgroundColor: '#455571',
        }
    });

    const ReplyDivider = styled(Divider)({
        borderTop: '1px solid grey',
        height: '0%',
        // make sure the divider is always below the list item
        position: 'relative',
        // left: '50%',w
        // transform: 'translateY(-100%)',
        // make sure the divider is full width of the container
        width: 'calc(100% - 10px)',
    });

    const ReplyTextField = styled(TextField)({
        backgroundColor: '#242b38',
        borderRadius: '10px',
        // border: '1px solid black',
        width: '100%',
        color: 'white',
        '& .MuiInputBase-input': {
            color: 'white',
        },
        '& .MuiInput-underline:before': {
            borderBottom: '1px solid white',
        },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: '2px solid white',
        },
        '& .MuiInput-underline:after': {
            borderBottom: '2px solid white',
        },
    });

    const sendButton = () => {
        return (
            <InputAdornment position="end">
                <ListItemButton>
                    <CommentIcon fill='white' sx={{color:'white'}} onClick={() => {handleAddReply()}}/>
                </ListItemButton>
            </InputAdornment>
        );
    }

    const handleAddReply = async() => {
        let text = document.getElementById('reply_field').value
        // let senderId = '6366fe474c670183dd2bcae5'
        let senderId = auth.user?._id

        if (text === "") {
            console.log("Empty text field.")
        }
        else {
            let response = await communityStore.addReply(replyingTo, senderId, text, props.thread._id)
            console.log(response)
            document.getElementById('reply_field').value = "";
        }
    }
    
    const handleDeleteReply = async(replyId) => {
        let response = await communityStore.deleteReply(replyId, props.thread._id)
        console.log(response)
    }

    return (
        <LightListItem alignItems="flex-start" key={"item " + props.thread._id}>
            <ButtonGroup variant='outlined' sx={{ position: 'absolute', right: '0' }}>
                <ListItemText
                sx={{ flex: 'revert', paddingRight: '5px' }}
                primary={props.thread.likes.length}
                secondary={createUpvoteButton()}
                primaryTypographyProps={{ style: { color: 'white', textAlign: 'center' } }}
                secondaryTypographyProps={{ style: { color: 'whitesmoke' } }} />

                <ListItemText sx={{ flex: 'revert', paddingRight: '10px' }}
                primary={props.thread.dislikes.length}
                secondary={createDownvoteButton()}
                primaryTypographyProps={{ style: { color: 'white', textAlign: 'center' } }}
                secondaryTypographyProps={{ style: { color: 'whitesmoke' } }} />
                {
                    auth.user._id === user.id ? (
                        <ListItemText sx={{ flex: 'revert', paddingRight: '10px' }}
                        primary={'Delete'}
                        secondary={createDeleteButton()}
                        primaryTypographyProps={{ style: { color: 'white', textAlign: 'center' } }}
                        secondaryTypographyProps={{ style: { color: 'whitesmoke' } }} />
                    ) : (
                        <></>
                    )
                }
            </ButtonGroup>
            <ListItemButton divider
            sx={{ width: auth.user._id === user.id ? 'calc(100% - 120px)' : 'calc(100% - 56px)' }}>
                <ListItemAvatar>
                    <Avatar alt={username}
                    src={avatar}
                    sx={{ width: '100px', height: '100px', fontSize: '250%' }}>
                        {avatar}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={
                    <>
                        <Typography sx={primaryTypographyProps}>
                            {props.thread.threadName}
                        </Typography>
                        <Typography sx={{ color: '#a8a8a8' }}>
                            by: {user.first} {user.last}
                        </Typography>
                    </>
                } secondary={props.thread.threadText}
                primaryTypographyProps={{ style: { color: 'white' } }}
                secondaryTypographyProps={{ style: secondaryTypographyProps }} />
            </ListItemButton>
            <ReplyDivider flexItem />
            <ReplyTextField label="Write a reply..."
            id="reply_field"
            variant="filled"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ endAdornment: sendButton() }} />
            {
                threadreplies.length < 1 ? <></> : (
                    <LightListItem alignItems="flex-start" key={"replies"}>
                        {
                            threadreplies.map((reply, index)=>{
                                return (
                                    <BetterReplyButton divider onClick={() => {
                                            if (reply.senderId == auth.user?._id) {
                                                handleDeleteReply(reply._id)
                                            }
                                            else {
                                                setReplyingTo(reply._id)
                                                console.log(replyingTo)
                                            }
                                        }}>
                                        <ListItemAvatar>
                                            <Avatar alt={reply._id}
                                            src={reply._id}
                                            sx={{ width: '30px', height: '30px' }}>
                                                {reply._id}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                        primary={reply.replyMsg}
                                        secondary={new Date(reply.createdAt).toLocaleDateString()}
                                        primaryTypographyProps={{ style: { color: 'white', fontSize: '0.7em' } }}
                                        secondaryTypographyProps={{ style: { color: 'whitesmoke', fontSize: '0.5em' } }} />
                                    </BetterReplyButton>
                                );
                            })
                        }
                    </LightListItem>
                )
            }
        </LightListItem>
    );
}
import { React, useState, useContext, useEffect } from 'react';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Avatar, ListItemButton, ListItemText, ListItem, Divider, TextField, InputAdornment } from '@mui/material';
import { styled } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';

import { CommunityStoreContext } from '../../../../store/communityStore';

export default function CommunityThread(props) {

    const { communityStore } = useContext(CommunityStoreContext);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        findUserAvatar().then((res) => {
            setUsername(res.user);
            setAvatar(res.userAvatar);
        });
    }, [communityStore.TOP_THREADS]);

    const findUserAvatar = async () => {
        let userAvatar = '';
        let user = props.thread.senderId;
        let threadOwner = await communityStore.getUserById(user);
        console.log("In findUserAvatar 2: ");
        console.log(threadOwner);
        userAvatar = threadOwner.profilePic || threadOwner.firstName[0].toUpperCase() + threadOwner.lastName[0].toUpperCase();
        user = threadOwner.userName;
        return { userAvatar, user };
    }

    const BetterReplyButton = styled(ListItemButton)({
        // make the button full width
        width: '100%',

    });

    const LightListItem = styled(ListItem)({
        backgroundColor: '#29313f',
        borderRadius: '10px',
        border: '1px solid black',
        width:'100%',
        height: '0%',
        flexDirection:'column',
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
        height:'0%',
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
        width:'100%',
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
                    <CommentIcon fill='white' sx={{color:'white'}}/>
                </ListItemButton>
            </InputAdornment>
        );
    }

    const replies = props.thread.replies;
    return (
        <LightListItem alignItems="flex-start" key={"item " + props.thread.id}>
            <ListItemButton divider>
                <ListItemAvatar>
                    <Avatar alt={username} src={avatar} sx={{width: '100px', height: '100px', fontSize: '250%'}}>{avatar}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={props.thread.threadName} secondary={props.thread.threadText} primaryTypographyProps={{style: {color: 'white', fontSize:'3em'}}} secondaryTypographyProps={{style:{color:'whitesmoke', fontSize:'1em'}}}/>
            </ListItemButton>
            <ReplyDivider flexItem />
            <ReplyTextField label="Write a reply..." variant="filled" InputLabelProps={{style: {color:'white'}}} InputProps={{endAdornment: sendButton()}}/>
            {
                replies.length < 1 ? <></> : (
                    <LightListItem alignItems="flex-start" key={"replies"}>
                        {
                            replies.map((reply, index)=>{
                                return (
                                    <BetterReplyButton divider >
                                        <ListItemAvatar>
                                            <Avatar alt={reply.id} src={reply.id} sx={{width: '30px', height: '30px'}}>{reply.id}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={reply.replyMsg} secondary={reply.sentAt} primaryTypographyProps={{style: {color: 'white', fontSize:'0.7em'}}} secondaryTypographyProps={{style:{color:'whitesmoke', fontSize:'0.5em'}}}/>
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
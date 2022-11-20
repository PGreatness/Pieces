import { React, useState, useContext, useEffect } from 'react';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Avatar, ListItemButton, ListItemText, ListItem } from '@mui/material';
import { styled } from '@mui/material';

import { CommunityStoreContext } from '../../../../store/communityStore';

export default function CommunityMainClickableThread(props) {
    const { communityStore } = useContext(CommunityStoreContext);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        findUserAvatar().then((res) => {
            setUsername(res.user);
            setAvatar(res.userAvatar);
        });
    }, [communityStore.TOP_THREADS])

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
        let user = props.thread.senderId;
        let threadOwner = await communityStore.getUserById(user);
        console.log("In findUserAvatar: ");
        console.log(threadOwner);
        userAvatar = threadOwner.profilePic || threadOwner.firstName[0].toUpperCase() + threadOwner.lastName[0].toUpperCase();
        user = threadOwner.userName;
        return { userAvatar, user };
    }

    return (
        <LightListItem alignItems="flex-start" onClick={props.selectThread} key={"item " + props.thread.id}>
            <ListItemButton>
                <ListItemAvatar>
                    <Avatar alt={username} src={avatar} sx={{ width: '50px', height: '50px' }}>{avatar}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={props.thread.threadName} secondary={props.thread.threadText} primaryTypographyProps={{ style: { color: 'white' } }} secondaryTypographyProps={{ style: { color: 'whitesmoke' } }} />
            </ListItemButton>
        </LightListItem>
    )
}
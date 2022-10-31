import React from 'react';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Avatar, ListItemButton, ListItemText, ListItem } from '@mui/material';
import { styled } from '@mui/material';

export default function CommunityMainClickableThread(props) {

    const LightListItem = styled(ListItem)({
        backgroundColor: '#455571',
        borderRadius: '10px',
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
    const findUserAvatar = () => {
        let userAvatar = '';
        let user = props.thread.senderId;
        // const response = await fetch(`/api/users/${user}`);
        // const data = await response.json();
        const response = {
            "id": 1,
            "username": "test",
            "firstName": "Test",
            "lastName": "User",
            "email": "test@test.com",
            "profilePic": "https://i.imgur.com/0y0y0y0.png",
            "createdAt": "2021-08-01T00:00:00.000Z",
            "updatedAt": "2021-08-01T00:00:00.000Z"
        };
        const data = response; // await response.json();
        userAvatar = data.profilePic || data.firstName.chatAt(0) + data.lastName.charAt(0);
        return [userAvatar, data.username];
    }

    const [currentUserAvatar, username] = findUserAvatar();
    return (
        <LightListItem alignItems="flex-start" onClick={props.selectThread} key={"item " + props.thread.id}>
            <ListItemButton>
                <ListItemAvatar>
                    <Avatar alt={username} src={currentUserAvatar} sx={{width: '50px', height: '50px'}}>{currentUserAvatar ? '': username}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={props.thread.threadName} secondary={props.thread.threadText} primaryTypographyProps={{style: {color: 'white'}}} secondaryTypographyProps={{style:{color:'whitesmoke'}}}/>
            </ListItemButton>
        </LightListItem>
    )
}
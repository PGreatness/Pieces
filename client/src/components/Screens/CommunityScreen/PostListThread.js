import React from 'react';
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { ThemeProvider } from '@emotion/react';

import { CommunityStoreContext } from '../../../store/communityStore';

import './css/postListItems.css';
export default function PostListThread(props) {
    const { communityStore } = React.useContext(CommunityStoreContext);

    const handleClick = async () => {
        await communityStore.setThreadAsTop(props.thread._id);
    }

    const primaryProps = {
        color: 'white',
        fontWeight: 'bold',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: 'calc(100% - 10px)',
    }
    const secondaryProps = {
        color: 'white',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: 'calc(100% - 10px)',
    }

    const ColoredListItem = styled(ListItem)({
        '&:hover': {
            backgroundColor: '#1E2A4A',
        },
    });
    return (
        <>
            <ColoredListItem button
                sx={{ color: 'white' }}
                className="myposts-sidebar-item"
                onClick={handleClick} >
                <ListItemText primary={props.thread.threadName}
                    secondary={props.thread.threadText}
                    primaryTypographyProps={{ style: primaryProps }}
                    secondaryTypographyProps={{ style: secondaryProps }} />
            </ColoredListItem>
            <Divider light />
        </>
    );
}
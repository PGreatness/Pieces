import React from 'react';
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import { ThemeProvider } from '@emotion/react';

export default function PostListReply(props) {

    const ColoredListItem = styled(ListItem)({
        '&:hover': {
            backgroundColor: '#1E2A4A',
        },
    });

    return (
        <>
            <ColoredListItem button sx={{ color: 'white' }}>
                <ListItemText primary={props.reply.replyMsg} />
            </ColoredListItem>
            <Divider light />
        </>
    );

}
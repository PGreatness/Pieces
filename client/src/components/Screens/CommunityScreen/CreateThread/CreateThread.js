import { React, useState, useEffect, useContext } from 'react';
import { Typography, Box, Button, TextField, InputAdornment, Input } from '@mui/material';

import { CommunityStoreContext } from '../../../../store/communityStore';
import AuthContext from '../../../../auth/auth';

import './css/createThread.css';
export default function CreateThread(props) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { communityStore } = useContext(CommunityStoreContext);
    const { auth } = useContext(AuthContext);

    const handleCreate = async () => {
        console.log('Creating new thread');
        const thread = await communityStore.createThread(title, content, auth.user._id);
        console.log(thread);
        console.log('Thread created successfully');
        props.exit();
        props.snack(true, 'Thread created successfully', 'success');
    }

    return (
        <>
            <div className='create-thread-set-title'>
                <Typography variant='h4' className='create-thread-title'>Title: </Typography>
                <TextField
                    className='create-thread-title-input'
                    variant='filled'
                    placeholder="A title for your new thread..."
                    placeholderProps={{ color: 'white' }}
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                />
            </div>
            <div className='create-thread-set-content'>
                <Typography variant='h4' className='create-thread-content'>Content: </Typography>
                <TextField
                    className='create-thread-content-input'
                    multiline
                    variant='filled'
                    minRows={10}
                    placeholder='What do you want to talk about?'
                    value={content}
                    onChange={(e) => { setContent(e.target.value) }}
                />
            </div>
            <div className='create-thread-submit'>
                <Button
                    variant='contained'
                    onClick={handleCreate}
                >
                    Submit
                </Button>
            </div>
        </>
    );
}
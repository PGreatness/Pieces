import React from 'react';
import CommunityMain from './CommunityMain/CommunityMain';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import './css/communityScreen.css';
export default function CommunityScreen() {

    const topThreads = [
        {
            id: 1,
            threadName: 'This is a test thread',
            threadText: 'This is a test thread',
            senderId: 3,
            sentAt: '2021-08-01T00:00:00.000Z',
            replies: []
        },
        {
            id: 2,
            threadName: 'This is a test thread 2',
            threadText: 'This is a test thread 2',
            senderId: 3,
            sentAt: '2021-08-01T00:00:00.000Z',
            replies: [
                {
                    'id': 1,
                    senderId: 2,
                    replyMsg: "This is a test reply",
                    sentAt: "2021-08-01T00:00:00.000Z",
                    replyingTo: 3
                },
                {
                    'id': 2,
                    senderId: 1,
                    replyMsg: "This is a test reply 2",
                    sentAt: "2021-08-01T00:00:00.000Z",
                    replyingTo: 3
                }
            ]
        },
        {
            id: 3,
            threadName: 'This is a test thread 3',
            threadText: 'This is a test thread 3',
            senderId: 3,
            sentAt: '2021-08-01T00:00:00.000Z',
            replies: []
        },
        {
            id: 4,
            threadName: 'This is a test thread 4',
            threadText: 'This is a test thread 4',
            senderId: 3,
            sentAt: '2021-08-01T00:00:00.000Z',
            replies: []
        },
    ];
    return (
        <>
            <div className='community-screen'>
                <div className='community-screen-text'>
                    <br />
                    <h1>Top Threads</h1>
                    <Button style={{ backgroundColor: "#10ba36", float: 'right' }}>
                        <div className="button_text">New Thread</div>
                        <AddIcon className="button_icons" ></AddIcon>
                    </Button>
                </div>
                <CommunityMain topThreads={topThreads} />
            </div>
        </>
    )
}
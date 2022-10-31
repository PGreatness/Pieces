import React from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import PostListThread from './PostListThread';
import PostListReply from './PostListReply';
import Chip from '@mui/material/Chip';

import { styled } from '@mui/material';

import './css/postListSidebar.css';

const WhiteChip = styled(Chip)({
    backgroundColor: 'white',
    color: 'black',
});

const WhiteDivider = styled(Divider)({
    '&::before': {
        borderTopColor: 'rgb(255,255,255)',
    },
    '&::after': {
        borderTopColor: 'rgb(255,255,255)',
    },
    '& .MuiDivider-root': {
        borderColor: 'rgb(255,255,255)',
    },
});

export default function PostListSidebar(props) {

    const getAllPosts = () => {
        // const response = await fetch(`/api/posts/${props.communityId}`);
        // const data = await response.json();
        const response = {
            "threads": [
                {
                    "id": 1,
                    "threadName": "Test Thread",
                    "threadText": "This is a test thread",
                    "senderId": 3,
                    "sentAt": "2021-08-01T00:00:00.000Z",
                    "replies": []
                },
                {
                    "id": 2,
                    "threadName": "Test Thread 2",
                    "threadText": "This is a test thread 2",
                    "senderId": 3,
                    "sentAt": "2021-08-01T00:00:00.000Z",
                    "replies": [
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
                }
            ],
            "replies": [
                {
                    'id': 4,
                    senderId: 3,
                    replyMsg: "This is a test reply to another thread",
                    sentAt: "2021-08-01T00:00:00.000Z",
                    replyingTo: 2
                }
            ]
        };
        const data = response; // await response.json();
        return data;
    }

    const getOnlyFilteredPosts = () => {
        // const response = await fetch(`/api/posts/${props.communityId}/${props.filteredName}`);
        // const data = await response.json();
        const response = {
            "threads": [
                {
                    "id": 1,
                    "threadName": "Test Thread",
                    "threadText": "This is a test thread",
                    "senderId": 3,
                    "sentAt": "2021-08-01T00:00:00.000Z",
                    "replies": []
                },
                {
                    "id": 2,
                    "threadName": "Test Thread",
                    "threadText": "This is a test thread 2",
                    "senderId": 3,
                    "sentAt": "2021-08-01T00:00:00.000Z",
                    "replies": [
                        {
                            'id': 1,
                            senderId: 2,
                            replyMsg: "This is a test reply",
                            sentAt: "2021-08-01T00:00:00.000Z",
                            replyingTo: 3
                        }
                    ]
                }
            ],
        };
        const data = response; // await response.json();
        return data;
    }


    const allPosts = (props.filterName) ? getOnlyFilteredPosts() : getAllPosts();
    if (!props.filteredName) {
        return (
            <div className='postlist-sidebar-postlist'>
                <List>
                    <WhiteDivider >
                        <WhiteChip label='My Threads' />
                    </WhiteDivider>
                {
                    allPosts.threads.map((thread)=>{
                        return (
                            <PostListThread key={thread.id} thread={thread} />
                            );
                        })
                }
                <WhiteDivider>
                    <WhiteChip label='My Replies' />
                </WhiteDivider>
                {allPosts.replies.map((reply)=>{
                    return (
                        <PostListReply key={reply.id} reply={reply} />
                    );
                    })
                }
                </List>
            </div>
        )
    }
    return (
        <div className='postlist-sidebar-postlist'>
            <List>
                <WhiteDivider >
                    <WhiteChip label='Threads'/>
                </WhiteDivider>
            {
                allPosts?.threads?.map((thread)=>{
                    return (
                        <PostListThread key={thread.id} thread={thread} />
                        );
                    })
            }
            <WhiteDivider>
                <WhiteChip label='Replies' />
            </WhiteDivider>
            {allPosts?.replies?.map((reply)=>{
                return (
                    <PostListReply key={reply.id} reply={reply} />
                );
                })
            }
            </List>
        </div>
    )
}
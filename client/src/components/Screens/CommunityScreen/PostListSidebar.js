import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import PostListThread from './PostListThread';
import PostListReply from './PostListReply';
import Chip from '@mui/material/Chip';
import { CommunityStoreContext } from '../../../store/communityStore';
import AuthContext from '../../../auth/auth';
import { React, useContext, useEffect, useState } from 'react';
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
    borderColor: 'rgb(255,255,255)',
});

const BackgroundColorList = styled(List)({
    backgroundColor: '#11182A',
});

export default function PostListSidebar(props) {
    const { communityStore } = useContext(CommunityStoreContext);
    const { auth } = useContext(AuthContext);
    const [myThreads, setMyThreads] = useState([]);
    const [myReplies, setMyReplies] = useState([]);
    const [activeFilter, setActiveFilter] = useState(props.filter);

    const getAllPosts = async () => {
        const response = await communityStore.getPostsByUser(auth.user._id, activeFilter);
        console.log(response);
        return { threads: response.threads, replies: response.replies };
    }

    useEffect(() => {
        getAllPosts().then((posts) => {
            console.log("SETTING POSTS");
            console.log(posts.threads);
            console.log(posts.replies);

            setMyThreads(posts.threads);
            setMyReplies(posts.replies);
        });
    }, [activeFilter, communityStore.ALL_THREADS]);

    useEffect(() => {
        setActiveFilter(props.filter.trim());
    }, [props.filter]);


    return (
        <div className='postlist-sidebar-postlist'>
            <BackgroundColorList>
                {
                    myThreads.length !== 0 ? (
                        <>
                            <WhiteDivider >
                                <WhiteChip label={activeFilter !== '' ? "Threads" : 'My Threads'} />
                            </WhiteDivider>
                            {
                                myThreads.map((thread) => (
                                    <PostListThread key={thread.id} thread={thread} />
                                ))
                            }
                        </>
                    ) : (
                        <></>
                    )
                }
                {
                    myReplies.length !== 0 ? (
                        <>
                            <WhiteDivider >
                                <WhiteChip label={activeFilter !== '' ? "Replies" : 'My Replies'} />
                            </WhiteDivider>
                            {
                                myReplies.map((reply) => (
                                    <PostListReply key={reply.id} reply={reply} />
                                ))
                            }
                        </>
                    ) : (
                        <></>
                    )
                }
            </BackgroundColorList>
        </div>
    );
}
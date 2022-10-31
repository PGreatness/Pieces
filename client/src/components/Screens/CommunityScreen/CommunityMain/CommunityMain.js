import React from 'react';
import CommunityMainThreadList from './CommunityMainThreadList';
import './css/communityMain.css';
export default function CommunityMain(props) {

    const topThreads = props.topThreads;

    return (
        <>
            <div className='community-main'>
                <div className='community-main-top-threads'>
                    <CommunityMainThreadList threadList={topThreads}/>
                </div>
            </div>
        </>
    )
}
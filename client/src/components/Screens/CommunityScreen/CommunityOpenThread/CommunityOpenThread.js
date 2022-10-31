import React from 'react';
import CommunityThread from './CommunityThread';
export default function CommunityOpenThread(props) {

    return (
        <div className='community-open-thread'>
            <CommunityThread thread={props.thread}/>
        </div>
    )
}
import {React, useContext, useState, useEffect } from 'react';
import CommunityMainThreadList from './CommunityMainThreadList';
import './css/communityMain.css';
import { CommunityStoreContext } from '../../../../store/communityStore';

export default function CommunityMain(props) {
    const { communityStore } = useContext(CommunityStoreContext);
    console.log(communityStore);
    const [topThreads, setTopThreads] = useState(communityStore.ALL_THREADS);

    useEffect(() => {
        console.log("Updating all threads");
        console.log(communityStore);
        setTopThreads(communityStore.TOP_THREADS);
    }, [communityStore.TOP_THREADS])

    return (
        <div className='community-main'>
            <CommunityMainThreadList threadList={topThreads} />
        </div>
    )
}
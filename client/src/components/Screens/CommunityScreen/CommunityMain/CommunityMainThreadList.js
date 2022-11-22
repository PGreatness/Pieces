import React from 'react';
import CommunityMainClickableThread from './CommunityMainClickableThread';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import CommunityThread from '../CommunityOpenThread/CommunityThread';
import { CommunityStoreContext } from '../../../../store/communityStore';

import './css/communityMainThreadList.css';


export default function CommunityMainThreadList(props) {
    const { communityStore } = React.useContext(CommunityStoreContext);
    const threadList = props.threadList;
    var selectedIndex = communityStore.SELECTED_INDEX;

    /**
 * 
 * @param {MouseEvent} e
 */
    const handleOutsideClick = (e) => {
        console.log(e)
        if (!e.target.className.includes('Mui')) {
            communityStore.setSelectedIndex(-1);
        }
    }
        return (
            <div className='community-main-thread-list' onClick={handleOutsideClick}>
                <div className='community-main-thread-list-div' style={{overflow: 'auto'}}>
                    <Stack spacing={2}>
                    {
                        threadList?.map((thread, index)=>{
                            return (
                                index === selectedIndex ?
                                <CommunityThread thread={thread}
                                key={thread._id}
                                deselect={()=>communityStore.setSelectedIndex(-1)}/>
                                :
                                <CommunityMainClickableThread
                                thread={thread}
                                key={thread._id}
                                selectThread={()=>communityStore.setSelectedIndex(index)}/>
                                );
                        })
                    }
                    </Stack>
                </div>
            </div>
        )
}
import React from 'react';
import CommunityMainClickableThread from './CommunityMainClickableThread';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import CommunityOpenThread from '../CommunityOpenThread/CommunityOpenThread';

import './css/communityMainThreadList.css';


export default function CommunityMainThreadList(props) {
    const threadList = props.threadList;
    const [selectedIndex, setSelectedIndex] = React.useState(-1);

    /**
 * 
 * @param {MouseEvent} e
 */
    const handleOutsideClick = (e) => {
        console.log(e.target)
        if (!e.target.className.includes('Mui')) {
            setSelectedIndex(-1);
        }
    }
        return (
            <div className='community-main-thread-list' onClick={handleOutsideClick}>
                <div className='community-main-thread-list-div'>
                    <Stack spacing={2}>
                    {
                        threadList.map((thread, index)=>{
                            return (
                                index === selectedIndex ? <CommunityOpenThread thread={thread} key={thread.id}/> : <CommunityMainClickableThread thread={thread} key={thread.id} selectThread={()=>setSelectedIndex(index)}/>
                                );
                        })
                    }
                    </Stack>
                </div>
            </div>
        )
}
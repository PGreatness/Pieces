import React from 'react';
import CommunityMain from './CommunityMain/CommunityMain';
import CreateThread from './CreateThread/CreateThread';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import CreateThreadSnack from './CreateThread/CreateThreadSnack/CreateThreadSnack';
import { CommunityStoreContext } from '../../../store/communityStore';
import './css/communityScreen.css';
export default function CommunityScreen() {
    const { communityStore } = React.useContext(CommunityStoreContext);
    const [createThread, setCreateThread] = React.useState(false);
    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState('');
    const [snackSeverity, setSnackSeverity] = React.useState('info');

    const handleSnack = (open, message, severity) => {
        console.log("WE GOT TO THE HaNDLE WITH: ", open, message, severity);
        setSnackOpen(open);
        setSnackMessage(message);
        setSnackSeverity(severity);
    }

    const title = (
        createThread ? <h1>Create a New Thread</h1>
        :
        (
            communityStore.TOP_THREADS.length === 1 ?
            <h1>Filtered Threads</h1>
            :
            <h1>Top Threads</h1>
        )
    );

    const buttons = (
        communityStore.TOP_THREADS.length !== 1 && !createThread ? <></> :
        <Button style={{ backgroundColor: '#3f51b5', float: 'left' }}
            onClick={()=>communityStore.getPopularThreads(1)}>
            <div className='button_text'>Clear Filter</div>
            <FilterAltOffIcon className="button_icons"></FilterAltOffIcon>
        </Button>
    );

    return (
        <>
            <div className='community-screen'>
                <div className='community-screen-text'>
                    <br />
                    { buttons }
                    { title }
                    {
                        createThread ?
                            (<Button style={{ backgroundColor: "#10ba36", float: 'left' }} onClick={() => setCreateThread(false)}>
                                <div className="button_text">Exit</div>
                                <ArrowBackIcon className='button_icons'></ArrowBackIcon>
                            </Button>)
                            :
                            (<Button style={{ backgroundColor: "#10ba36", float: 'right' }} onClick={() => setCreateThread(true)}>
                                <div className="button_text">New Thread</div>
                                <AddIcon className="button_icons" ></AddIcon>
                            </Button>)
                    }
                </div>
                {
                    createThread ? <CreateThread exit={()=>setCreateThread(false)} snack={handleSnack}/> : <CommunityMain />
                }
                <CreateThreadSnack open={snackOpen} message={snackMessage} severity={snackSeverity}/>
            </div>
        </>
    )
}
import React from 'react';
import CommunityMain from './CommunityMain/CommunityMain';
import CreateThread from './CreateThread/CreateThread';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateThreadSnack from './CreateThread/CreateThreadSnack/CreateThreadSnack';
import './css/communityScreen.css';
export default function CommunityScreen() {
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

    return (
        <>
            <div className='community-screen'>
                <div className='community-screen-text'>
                    <br />
                    {
                        createThread ? <h1>Create a New Thread</h1> : <h1>Top Threads</h1>
                    }
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
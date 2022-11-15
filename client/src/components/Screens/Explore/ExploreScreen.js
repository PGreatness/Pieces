import * as React from 'react';
import { useState, useContext } from "react";
import Box from '@mui/material/Box';
import Explore from './Explore'
import ExploreComments from './ExploreComments'
import { GlobalStoreContext } from '../../../store/store'
import AuthContext from '../../../auth/auth';

export default function ExploreScreen(props) {
    const [showComments, setShowComments] = useState(false);
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [projectId, setProjectId] = useState("6369da333c60b432f2bc4853");

    return (
        <>
        <Box style={{height: '100%', width: '80vw', color: 'white', backgroundColor: '#1F293A',
         display:'flex', zIndex:0, position: 'relative'}}>
            {!showComments? (<Explore 
                setLoc={props.setLoc}
                setShowComments={async () => {
                    await store.loadPublicProjectComments();
                    console.log("here in setShow: ");
                    console.log(store);
                    setShowComments(true);
                }}
                projectId = {projectId}
                setProjectId = {setProjectId}
            />): (<ExploreComments
                setShowComments={() => {
                    setShowComments(false);
                }}
                projectId = {projectId}
                setProjectId = {setProjectId}
            />)}
        </Box>
        </>
    )
}
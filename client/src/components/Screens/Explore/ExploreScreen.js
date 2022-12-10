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
    const [commentsProject, setCommentsProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [owner, setOwner] = useState(null);

    return (
        <>
        <Box style={{height: '100%', width: '80vw', color: 'white', backgroundColor: '#1F293A',
         display:'flex', zIndex:0, position: 'relative'}}>
            {!showComments? (<Explore 
                setLoc={props.setLoc}
                setShowComments={async (project) => {
                    //await store.loadPublicProjectComments();
                    let comments = await store.getProjectComments(project._id)
                    setComments(comments)
                    console.log('infinite')

                    auth.getUserById((project.ownerId), (user) => {
                        setOwner(user)
                        console.log(user)
                        setShowComments(true);
                    })

                }}
                commentsProject = {commentsProject}
                setCommentsProject = {setCommentsProject}
            />): (<ExploreComments
                setShowComments={() => {
                    setShowComments(false);
                }}
                commentsProject = {commentsProject}
                setCommentsProject = {setCommentsProject}
                comments = {comments}
                owner={owner}
            />)}
        </Box>
        </>
    )
}
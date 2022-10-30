import * as React from 'react';
import Box from '@mui/material/Box';
import SocialSidebar from '../../SocialSidebar/SocialSidebar'
import Explore from './Explore'
import ExploreComments from './ExploreComments'
import { useNavigate } from 'react-router-dom';


export default function ExploreScreen() {
    const navigate = useNavigate();
    const [showComments, setShowComments] = React.useState(false);


    return (
        <Box style={{ height: '100%', color: 'white', backgroundColor: '#1F293A', display:'flex'}}>
            <SocialSidebar></SocialSidebar>
            <Explore 
                setShowComments={setShowComments}
            />
            <ExploreComments
                showComments={showComments}
            />
        </Box>
    )
}
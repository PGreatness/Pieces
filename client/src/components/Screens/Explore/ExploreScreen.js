import * as React from 'react';
import Box from '@mui/material/Box';
import Explore from './Explore'
import ExploreComments from './ExploreComments'
import { useNavigate } from 'react-router-dom';


export default function ExploreScreen(props) {
    const navigate = useNavigate();
    const [showComments, setShowComments] = React.useState(false);
    
    return (
        <Box style={{height: '100%', width: '80vw', color: 'white', backgroundColor: '#1F293A',
         display:'flex', zIndex:0, position: 'relative'}}>
            {/* <SocialSidebar></SocialSidebar> */}
            {!showComments? (<Explore setLoc={props.setLoc}
                setShowComments={() => {
                    setShowComments(true);
                }}
            />): (<ExploreComments
                setShowComments={() => {
                    setShowComments(false);
                }}
            />)}
        </Box>
    )
}
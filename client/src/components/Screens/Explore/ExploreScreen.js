import * as React from 'react';
import Box from '@mui/material/Box';
import Explore from './Explore'
import ExploreComments from './ExploreComments'

export default function ExploreScreen(props) {
    const [showComments, setShowComments] = React.useState(false);
    
    return (
        <Box style={{height: '100%', width: '80vw', color: 'white', backgroundColor: '#1F293A',
         display:'flex', zIndex:0, position: 'relative'}}>
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
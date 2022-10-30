import * as React from 'react';
import Button from '@mui/material/Button';

export default function ExploreComments(props) {
    return (  
       <>
       {props.showComments? 
       (<div>Showing Comments</div>):
       (<div></div>)}
       </>
    )
}
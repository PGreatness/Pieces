import React from 'react';
import { ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function CreateMenuItem(props) {
    const navigate = useNavigate();

    return (
        <ListItem sx={{color: 'black', backgroundColor: 'white'}}>
            <ListItemButton onClick={()=>{props.setLoc(props.loc); navigate(`/${props.loc}`)}}>
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
                <ListItemText primary={props.text} />
            </ListItemButton>
        </ListItem>
    );
}
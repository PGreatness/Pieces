import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { Modal, Typography, List, ListItem, Grid, Button } from '@mui/material'
import { PersonRemove, AccountCircle, People, AddBox, LibraryAdd, SwapHoriz, ContentCopy, Delete,} from '@mui/icons-material'
import { Box, Stack } from '@mui/system';


export default function UserModalItem(props) {

    return (
        <Grid container style={{ backgroundColor: "#1f293a" }}>
            <Grid item xs={1}>
                <AccountCircle />
            </Grid>
            <Grid item xs={5}>
                <Typography color='azure'>{props.user.firstName} {props.user.lastName}</Typography>
            </Grid>
            <Grid item xs={1}>
                <Button style={{ minHeight: '30px', maxHeight: '30px', minWidth: '30px', maxWidth: '30px' }}>
                    {props.owner? 
                    <PersonRemove onClick={()=> props.removeCollaborator(props.user._id)}/> : <></>
                    }
                </Button>
            </Grid>
            <Grid align='center' item xs={5}>
                <Typography color='azure'>Collaborator</Typography>
            </Grid>
        </Grid>
    )
}
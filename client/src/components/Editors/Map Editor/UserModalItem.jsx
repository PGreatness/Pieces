import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { Modal, Typography, List, ListItem, Grid, Button } from '@mui/material'
import { PersonRemove, AccountCircle, People, AddBox, LibraryAdd, SwapHoriz, ContentCopy, Delete, } from '@mui/icons-material'
import { Avatar } from "@mui/material";
import { Box, Stack } from '@mui/system';


export default function UserModalItem(props) {

    return (
        <Grid container style={{ backgroundColor: "#1f293a", height: "60px", paddingTop: "10px", }}>
            <Grid item xs={2} style={{ paddingLeft: '5px' }}>
                <Avatar src={props.user?.profilePic?.url}
                    sx={{
                        width: 35,
                        height: 35,
                        fontSize: "20px",
                        bgcolor: "rgb(2, 0, 36)",
                        border: "rgba(59, 130, 206, 1) 2px solid"
                    }}>
                    {props.user.firstName.charAt(0)}{props.user.lastName.charAt(0)}
                </Avatar>
            </Grid>
            <Grid item xs={8}>
                <Typography color='azure' sx={{paddingLeft: "10px", marginTop: '8px'}}>{props.user.firstName} {props.user.lastName}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Button style={{ minHeight: '30px', maxHeight: '30px', minWidth: '30px', maxWidth: '30px' }} sx={{paddingRight: "40px", marginTop: '5px'}}>
                    {props.owner ?
                        <PersonRemove onClick={() => props.removeCollaborator(props.user._id)} /> : <></>
                    }
                </Button>
            </Grid>

        </Grid>
    )
}
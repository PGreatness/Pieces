import React from 'react';
import './css/profile.css';
import { useState, useContext, useEffect } from 'react';
import TextField from "@mui/material/TextField"
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';
import AuthContext from '../../../auth/auth';
import { GlobalStoreContext } from '../../../store/store'
import { deepOrange, deepPurple } from '@mui/material/colors';

export default function ProfileScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const handleLogout = () => {
        auth.logoutUser(store);
    }

    return (
        <div className="profile_body">
            <div className="profile_title">
                Account Settings
            </div>
            <div className="profile_content">
                <div className="profile_picture">
                    <Avatar sx={{ bgcolor: deepOrange[500], width: 250, height: 250 }} >
                        JS
                    </Avatar>
                    <br></br>
                    <div className="profile_padding">
                        <Button>
                            <EditIcon sx={{ fontSize: 35 }}></EditIcon>
                        </Button>
                    </div>
                </div>
                <div className="profile_fields">
                    <div className="profile_flexbox">
                        <span className="profile_fields_text">
                            Username:
                        </span>
                        <TextField id="filled-basic" label="john123" variant="filled" />
                    </div>
                    <br></br>
                    <div className="profile_flexbox">
                        <span className="profile_fields_text">
                            Email:
                        </span> 
                        <TextField id="filled-basic" label="john123@gmail.com" variant="filled" />
                    </div>
                    <br></br>
                    <div className="profile_flexbox">
                        <span className="profile_fields_text">
                            Password:
                        </span>
                        <TextField id="filled-basic" label="xxxxxx" variant="filled" />
                    </div>
                    <br></br>
                    <div className="profile_flexbox">
                        <span className="profile_fields_text">
                            Display Name:
                        </span>
                        <TextField id="filled-basic" label="John Smith" variant="filled" />
                    </div>
                    <br></br>
                    <div className="profile_flexbox">
                        <span className="profile_fields_text">
                            Bio:
                        </span>
                        <TextField
                            id="filled-multiline-static"
                            label="Bio"
                            multiline
                            rows={4}
                            defaultValue="Hey! I'm John Smith."
                            variant="filled"
                        />
                    </div>
                    <br></br>
                    
                    <Stack direction="row" spacing={2}>
                    <Button disabled>Clear</Button>
                    <Button>Save</Button>
                    <Button onClick={handleLogout}>Logout</Button>
                    </Stack>
                </div>
            </div>
        </div>
    )
}
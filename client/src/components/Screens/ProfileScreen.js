import React from 'react';
import './../css/profile.css';
import TextField from "@mui/material/TextField"
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';

export default function ProfileScreen() {
    return (
        <div className="profile_body">
            <div className="profile_title">
                Account Settings
            </div>
            <div className="profile_content">
                <div className="profile_picture">
                    John Smith Default<br></br>
                    Profile Picture
                    <br></br>
                    <EditIcon></EditIcon>
                </div>
                <div className="profile_fields">
                    <div className="profile_flexbox">
                        <span className="profile_fields_text">
                            First Name:
                        </span>
                        <TextField id="filled-basic" label="John" variant="filled" />
                    </div>
                    <br></br>
                    <div className="profile_flexbox">
                        <span className="profile_fields_text">
                            Last Name:
                        </span>
                        <TextField id="filled-basic" label="Smith" variant="filled" />
                    </div>
                    <br></br>
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

                    <Stack direction="row" spacing={2}>
                    <Button disabled>Clear</Button>
                    <Button>Save</Button>
                    </Stack>
                </div>
            </div>
        </div>
    )
}
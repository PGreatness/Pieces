import React from 'react';
import './css/profile.css';
import { useState, useContext, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import AuthContext from '../../../auth/auth';
import { Input, InputAdornment, Typography } from '@mui/material';
import { Modal, TextField, Grid, Box, Button } from '@mui/material'
import { Check, Colorize, Clear } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { GlobalStoreContext } from '../../../store/store'
import { deepOrange, deepPurple } from '@mui/material/colors';

export default function ProfileScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const handleCloseDeleteUserModal = () => {
        setOpenDeleteUserModal(false)
    }

    const handleOpenDeleteUserModal = () => {
        setOpenDeleteUserModal(true)
    }

    const handleCloseEditMode = () => {
        setEditMode(false)
    }

    const handleOpenEditMode = () => {
        setEditMode(true)
    }

    const handleEdit = () => {
        setEditMode(true)
    }

    const handleDeleteUser = () => {
        handleCloseDeleteUserModal();
        // call store method to delete user
    }




    return (
        <div className="profile_body">

            {editMode ?

                <Grid container sx={{
                    paddingLeft: "150px", paddingRight: "150px",
                    alignItems: 'center', justifyContent: 'center'
                }} spacing={8}>
                    <Grid item xs={4}>
                        <Avatar sx={{
                            bgcolor: '#2DD4CF', width: 420, height: 420, fontSize: '200px', color: 'black',
                            border: "black 2px solid", cursor: "pointer"
                        }}>
                            {auth?.user.firstName.charAt(0)}{auth?.user.lastName.charAt(0)}
                        </Avatar>
                        <CameraAltIcon style={{fontSize: "100px", marginTop: "-50px", 
                            marginLeft: '330px', color: 'white'}}/>
                    </Grid>

                    <Grid item xs={1}></Grid>

                    <Grid component="form" noValidate onSubmit={handleEdit}
                        item xs={7} sx={{ width: '100%', height: '100%', marginTop: '4%' }}>

                        <Grid container direction={'row'}>
                            <Grid item xs={5}>
                                <Grid container direction={'column'}>
                                    <Typography variant='h4' color='azure'>First Name:</Typography>
                                    <Grid container direction={'column'} sx={{ marginTop: '3px' }}>
                                        <TextField
                                            variant="filled"
                                            name="firstName"
                                            required
                                            id="firstName"
                                            defaultValue={auth?.user.firstName}
                                            sx={{
                                                "& .MuiInputBase-root": {
                                                    color: "azure", backgroundColor: '#11182A',
                                                    width: '85%', height: '38px', fontSize: "1.2rem", paddingBottom: '10px'
                                                }
                                            }}
                                        ></TextField>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={5}>
                                <Grid container direction={'column'}>
                                    <Typography variant='h4' color='azure'>Last Name:</Typography>
                                    <Grid container direction={'column'} sx={{ marginTop: '3px' }}>
                                        <TextField
                                            variant="filled"
                                            name="lastName"
                                            required
                                            id="lastName"
                                            defaultValue={auth?.user.lastName}
                                            sx={{
                                                "& .MuiInputBase-root": {
                                                    color: "azure", backgroundColor: '#11182A',
                                                    width: '85%', height: '38px', fontSize: "1.2rem", paddingBottom: '10px'
                                                }
                                            }}
                                        ></TextField>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container direction={'column'} sx={{ marginTop: '20px' }}>
                            <Typography variant='h4' color='azure'>Username:</Typography>
                            <Grid container direction={'column'} sx={{ marginTop: '3px' }}>
                                <TextField
                                    variant="filled"
                                    name="userName"
                                    required
                                    id="userName"
                                    defaultValue={auth?.user.userName}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            color: "azure", backgroundColor: '#11182A',
                                            width: '77%', height: '38px', fontSize: "1.2rem", paddingBottom: '10px'
                                        }
                                    }}
                                ></TextField>
                            </Grid>
                        </Grid>

                        <Grid container direction={'column'} sx={{ marginTop: '20px' }}>
                            <Typography variant='h4' color='azure'>Email:</Typography>
                            <Grid container direction={'column'} sx={{ marginTop: '3px' }}>
                                <TextField
                                    variant="filled"
                                    name="email"
                                    required
                                    id="email"
                                    defaultValue={auth?.user.email}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            color: "azure", backgroundColor: '#11182A',
                                            width: '77%', height: '38px', fontSize: "1.2rem", paddingBottom: '10px'
                                        }
                                    }}
                                ></TextField>
                            </Grid>
                        </Grid>


                        <Grid container direction={'column'} sx={{ marginTop: '20px' }}>
                            <Typography variant='h4' color='azure'>Bio:</Typography>
                            <Grid container direction={'column'} sx={{ marginTop: '3px' }}>
                                <TextField
                                    variant="filled"
                                    name="bio"
                                    required
                                    id="bio"
                                    defaultValue={auth?.user.bio}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            color: "azure", backgroundColor: '#11182A',
                                            width: '77%', height: '120px', fontSize: "1.2rem", paddingBottom: '10px'
                                        }
                                    }}
                                ></TextField>
                            </Grid>
                        </Grid>

                        <Grid container direction={'row'} sx={{ marginTop: '40px' }} xs={12}>
                            <Button onClick={() => {}}>
                                <Typography fontSize='1rem'>Change Password</Typography>
                            </Button>

                            <Button type="submit"
                                style={{
                                    backgroundColor: '#5CD098', color: 'white', width: '20%',
                                    height: '50px', marginRight: '15px', marginLeft: '35px'
                                }}>
                                <SaveAltIcon style={{ marginRight: '5px' }} />
                                <Typography variant="h6">Save</Typography>
                            </Button>

                            <Button onClick={handleCloseEditMode}
                                style={{
                                    backgroundColor: '#BA1D1D', color: 'white', width: '20%',
                                    marginRight: '0px', justifySelf: 'flex-end'
                                }}>
                                <Clear />
                                <Typography variant="h6">Cancel</Typography>
                            </Button>

                        </Grid>

                    </Grid>
                </Grid>

                :
                <Grid container sx={{
                    paddingLeft: "150px", paddingRight: "150px",
                    alignItems: 'center', justifyContent: 'center'
                }} spacing={8}>
                    <Grid item xs={4}>
                        <Avatar sx={{
                            bgcolor: '#2DD4CF', width: 420, height: 420, fontSize: '200px', color: 'black',
                            border: "black 2px solid", cursor: "pointer"
                        }}>
                            {auth?.user.firstName.charAt(0)}{auth?.user.lastName.charAt(0)}
                        </Avatar>
                    </Grid>

                    <Grid item xs={1}></Grid>

                    <Grid item xs={7} sx={{ width: '100%', height: '100%', marginTop: '4%' }}>

                        <Grid container direction={'row'}>
                            <Grid item xs={5}>
                                <Grid container direction={'column'}>
                                    <Typography variant='h4' color='azure'>First Name:</Typography>
                                    <Grid container direction={'column'} sx={{ marginTop: '3px' }}>
                                        <Typography fontSize="1.2rem" color='azure'>{auth?.user.firstName}</Typography>
                                        <hr style={{
                                            color: 'white', width: "85%", marginLeft: 0, marginTop: '4px'
                                        }}></hr>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={5}>
                                <Grid container direction={'column'}>
                                    <Typography variant='h4' color='azure'>Last Name:</Typography>
                                    <Grid container direction={'column'} sx={{ marginTop: '3px' }}>
                                        <Typography fontSize="1.2rem" color='azure'>{auth?.user.lastName}</Typography>
                                        <hr style={{
                                            color: 'white', width: "85%", marginLeft: 0, marginTop: '4px'
                                        }}></hr>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container direction={'column'} sx={{ marginTop: '20px' }}>
                            <Typography variant='h4' color='azure'>Username:</Typography>
                            <Grid container direction={'column'} sx={{ marginTop: '3px' }}>
                                <Typography fontSize="1.2rem" color='azure'>{auth?.user.userName}</Typography>
                                <hr style={{
                                    color: 'white', width: "77%", marginLeft: 0, marginTop: '4px'
                                }}></hr>
                            </Grid>
                        </Grid>

                        <Grid container direction={'column'} sx={{ marginTop: '20px' }}>
                            <Typography variant='h4' color='azure'>Email:</Typography>
                            <Grid container direction={'column'} sx={{ marginTop: '3px' }}>
                                <Typography fontSize="1.2rem" color='azure'>{auth?.user.email}</Typography>
                                <hr style={{
                                    color: 'white', width: "77%", marginLeft: 0, marginTop: '4px'
                                }}></hr>
                            </Grid>
                        </Grid>


                        <Grid container direction={'column'} sx={{ marginTop: '20px' }}>
                            <Typography variant='h4' color='azure'>Bio:</Typography>
                            <Grid container direction={'column'}
                                sx={{
                                    marginTop: '3px', width: '77%', height: '120px',
                                    backgroundColor: '#11182A'
                                }}>
                                <Typography color='azure'>{auth?.user.bio}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container direction={'row'} sx={{ marginTop: '40px' }} xs={12}>
                            <Button onClick={handleOpenDeleteUserModal}
                                style={{
                                    backgroundColor: '#BA1D1D', color: 'white', width: '20%',
                                    height: '50px'
                                }}>
                                <DeleteIcon />
                                <Typography variant="h6">Delete</Typography>
                            </Button>
                            <Grid item sx={{ width: '37%' }}></Grid>

                            <Button onClick={handleOpenEditMode}
                                style={{
                                    backgroundColor: '#5CD098', color: 'white', width: '20%',
                                    marginRight: '0px', justifySelf: 'flex-end'
                                }}>
                                <EditIcon></EditIcon>
                                <Typography variant="h6">Edit</Typography>
                            </Button>

                        </Grid>

                    </Grid>
                </Grid>
            }

            <Modal
                open={openDeleteUserModal}
                onClose={handleCloseDeleteUserModal}
            >
                <Box borderRadius='10px' padding='30px' bgcolor='#11182a' position='absolute' height='40%'
                    top='30%' left='30%' width='40%'>
                    <Stack direction='column'>
                        <Typography variant='h2' color='azure' marginBottom="50px">Delete User</Typography>
                        <Typography variant='h5' color='red'>Are you sure you want to delete your account?</Typography>
                        <Typography variant='h6' color='azure'>Ownership to your projects will be lost. Acces to other projects as collaborator will be revoked permanently</Typography>
                        <Stack direction='row'>
                            <Button onClick={handleDeleteUser}
                                style={{
                                    backgroundColor: '#BA1D1D', color: 'white', width: '20%',
                                    height: '50px', marginTop: '50px', marginLeft: '150px', marginRight: '50px'
                                }}>
                                <DeleteIcon />
                                <Typography variant="h6">Delete</Typography>
                            </Button>

                            <Button onClick={handleCloseDeleteUserModal}
                                style={{
                                    backgroundColor: '#5CD098', color: 'white', width: '20%',
                                    marginTop: '50px'
                                }}>
                                <Clear />
                                <Typography variant="h6">Cancel</Typography>
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Modal>


        </div>
    )
}
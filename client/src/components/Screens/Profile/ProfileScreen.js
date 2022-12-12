import React from 'react';
import './css/profile.css';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import ForwardIcon from '@mui/icons-material/Forward';
import Alert from '@mui/material/Alert';
import { GlobalStoreContext } from '../../../store/store'
import { deepOrange, deepPurple } from '@mui/material/colors';
import Cloudinary from "../../../cloudinary/cloudinary";

export default function ProfileScreen(props) {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const [user, setUser] = useState(auth.user)
    const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [openErrorModal, setOpenErrorModal] = useState(auth.errorMessage !== null)
    const [editMode, setEditMode] = useState(false);

    // useEffect(() => {
    //     console.log('in use effect idk')
    //     setUser(auth.user)
    // }, []);

    useEffect(() => {
        console.log(auth.errorMessage)
        setOpenErrorModal(auth.errorMessage !== null)
    }, [auth]);

    const handleErrorModalClose = () => {
        auth.resetMessage();
        setOpenErrorModal(false);
    };

    const handleCloseDeleteUserModal = () => {
        setOpenDeleteUserModal(false)
    }

    const handleOpenDeleteUserModal = () => {
        setOpenDeleteUserModal(true)
    }

    const handleClosePasswordModal = () => {
        setOpenPasswordModal(false)
    }

    const handleOpenPasswordModal = () => {
        setOpenPasswordModal(true)
    }

    const handleCloseEditMode = () => {
        setEditMode(false)
    }

    const handleOpenEditMode = () => {
        setEditMode(true)
    }

    const handleEdit = async function (event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        await auth.updateUser({
            id: auth.user._id,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            userName: formData.get('userName'),
            bio: formData.get('bio')
        }, (newUser) => {
            console.log(newUser)
            setUser(newUser)
        });

        setEditMode(false)

    }

    const handleDeleteUser = async function () {
        handleCloseDeleteUserModal();
        // call auth method to delete user
        await auth.deleteUser();

        await auth.logoutUser(store, () => {
            console.log('in logout')
            setUser(null);
            props.setLoc('/');
            navigate("/")
        });
    }

    const handleChangePassword = async function (event) {
        event.preventDefault();
        handleClosePasswordModal();
        // call auth method to change password

        const formData = new FormData(event.currentTarget);
        await auth.changePassword({
            email: formData.get('email'),
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword'),
            repeatNewPassword: formData.get('repeatNewPassword')
        }, (newUser) => {
            setUser(newUser)
        });

        //setUser(auth.user)
    }

    const onImageChangeHandler = async function (event) {
        let image = event.target.files[0];
        const cloud = await Cloudinary(image);
        console.log(cloud)

        await auth.uploadImage({
            id: user._id,
            publicId: cloud.publicId,
            url: cloud.url,
        }, (newUser) => {
            setUser(newUser)
        });

    };


    const handleDeleteUserImage = async function () {
        await auth.deleteImage({
            id: user._id,
            publicId: user.profilePic.publicId,
        }, (newUser) => {
            setUser(newUser)
        });
    }



    return (
        <div className="profile_body">

            {editMode ?

                <Grid container sx={{
                    paddingLeft: "150px", paddingRight: "150px",
                    alignItems: 'center', justifyContent: 'center'
                }} spacing={8}>
                    <Grid item xs={4}>
                        <Grid item xs={1}>
                            <Input
                                type="file"
                                id="avatarFileInput"
                                sx={{ margin: "10px", display: "none" }}
                                onChange={e => onImageChangeHandler(e)}
                            />
                        </Grid>
                        {user.profilePic ?
                            <Clear onClick={handleDeleteUserImage} style={{
                                fontSize: "80px", marginBottom: "-60px",
                                marginLeft: '20px', color: 'white'
                            }} />
                            :
                            <></>
                        }
                        <Avatar src={user.profilePic?.url} sx={{
                            bgcolor: '#2DD4CF', width: 420, height: 420, fontSize: '200px', color: 'black',
                            border: "black 2px solid", cursor: "pointer"
                        }}>
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </Avatar>
                        <Grid item xs={1}>
                            <label htmlFor="avatarFileInput">
                                <CameraAltIcon style={{
                                    fontSize: "100px", marginTop: "-50px",
                                    marginLeft: '330px', color: 'white'
                                }} />
                            </label>
                        </Grid>

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
                                            defaultValue={user.firstName}
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
                                            defaultValue={user.lastName}
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
                                    defaultValue={user.userName}
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
                                    defaultValue={user.email}
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
                                    defaultValue={user.bio}
                                    multiline
                                    rows={4}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            color: "azure", backgroundColor: '#11182A',
                                            width: '77%', fontSize: "1.2rem", paddingBottom: '10px'
                                        }
                                    }}
                                ></TextField>
                            </Grid>
                        </Grid>

                        <Grid container direction={'row'} sx={{ marginTop: '40px' }} xs={12}>
                            <Button onClick={handleOpenPasswordModal}>
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
                                <ForwardIcon />
                                <Typography variant="h6">Back</Typography>
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
                        <Avatar src={user.profilePic?.url} sx={{
                            bgcolor: '#2DD4CF', width: 420, height: 420, fontSize: '200px', color: 'black',
                            border: "black 2px solid", cursor: "pointer"
                        }}>
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </Avatar>
                    </Grid>

                    <Grid item xs={1}></Grid>

                    <Grid item xs={7} sx={{ width: '100%', height: '100%', marginTop: '4%' }}>

                        <Grid container direction={'row'}>
                            <Grid item xs={5}>
                                <Grid container direction={'column'}>
                                    <Typography variant='h4' color='azure'>First Name:</Typography>
                                    <Grid container direction={'column'} sx={{ marginTop: '3px' }}>
                                        <Typography fontSize="1.2rem" color='azure'>{user.firstName}</Typography>
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
                                        <Typography fontSize="1.2rem" color='azure'>{user.lastName}</Typography>
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
                                <Typography fontSize="1.2rem" color='azure'>{user.userName}</Typography>
                                <hr style={{
                                    color: 'white', width: "77%", marginLeft: 0, marginTop: '4px'
                                }}></hr>
                            </Grid>
                        </Grid>

                        <Grid container direction={'column'} sx={{ marginTop: '20px' }}>
                            <Typography variant='h4' color='azure'>Email:</Typography>
                            <Grid container direction={'column'} sx={{ marginTop: '3px' }}>
                                <Typography fontSize="1.2rem" color='azure'>{user.email}</Typography>
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
                                    backgroundColor: '#11182A', padding: '10px'
                                }}>
                                <Typography fontSize="1.2rem" color='azure'>{user.bio}</Typography>
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


            <Modal
                open={openPasswordModal}
                onClose={handleClosePasswordModal}
            >
                <Box
                    borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='40%' top='30%' left='30%'
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: "white" }}
                >

                    <Typography component="h1" variant="h5">
                        Change Password
                        </Typography>
                    <Box component="form" noValidate onSubmit={handleChangePassword} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    InputLabelProps={{ style: { color: "white" } }}
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" },
                                        "& .MuiInputBase-root": { color: "azure" }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="currentPassword"
                                    label="Current Password"
                                    type="password"
                                    id="currentPassword"
                                    autoComplete="new-password"
                                    InputLabelProps={{ style: { color: "white" } }}
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" },
                                        "& .MuiInputBase-root": { color: "azure" }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="newPassword"
                                    label="New Password"
                                    type="password"
                                    id="newPassword"
                                    autoComplete="new-password"
                                    InputLabelProps={{ style: { color: "white" } }}
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" },
                                        "& .MuiInputBase-root": { color: "azure" }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="repeatNewPassword"
                                    label="New Password Verify"
                                    type="password"
                                    id="repeatNewPassword"
                                    autoComplete="new-password"
                                    InputLabelProps={{ style: { color: "white" } }}
                                    sx={{
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" },
                                        "& .MuiInputBase-root": { color: "azure" }
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Change Password
                            </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                hideBackdrop
                open={openErrorModal}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{
                    position: 'absolute', top: '50%',
                    left: '50%', transform: 'translate(-50%, -50%)',
                    width: 400, bgcolor: 'white',
                    border: '2px solid #000', borderRadius: '10px',
                    boxShadow: 24, pt: 2,
                    px: 4, pb: 3
                }}
                >
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Alert severity="error">{auth.errorMessage}</Alert>
                        <Button onClick={handleErrorModalClose}>OK</Button>
                    </Grid>
                </Box>
            </Modal>


        </div>
    )
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from "react";
import './css/navbarAppOptions.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import { Input, InputAdornment, Typography } from '@mui/material';
import { Modal, TextField, Grid, Box, Button } from '@mui/material'
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import PeopleIcon from '@mui/icons-material/People';
import { Avatar } from "@mui/material";

import NotificationSidebar from '../NotificationSidebar/NotificationSidebar';
import { GlobalStoreContext } from '../../store/store'
import { CommunityStoreContext } from '../../store/communityStore';
import AuthContext from '../../auth/auth';


export default function NavbarAppOptions(props) {
    const WideInput = styled(Input)({
        width: '100%',
        backgroundColor: '#303139',
        borderRadius: '10px',
        height: '60%',
        fontSize: '21px',
        color: 'rgba(200, 200, 200, 1)',
        paddingLeft: '15px'
    });


    const navigate = useNavigate();

    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const { communityStore } = useContext(CommunityStoreContext);

    const [user, setUser] = useState(auth.user)
    const [loggedIn, setLoggedIn] = useState(auth.user? true: false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [openErrorModal, setOpenErrorModal] = useState(auth.errorMessage !== null)
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isProfileMenuOpen = Boolean(anchorEl);

    useEffect(() => {
        auth.getLoggedIn(store, (loggedInUser) => {
            setUser(loggedInUser)
            setLoggedIn(true)
            props.changeLoc('/explore')
            store.changePageToExplore();
            navigate("/explore")
        });
    }, []);

    useEffect(() => {
        console.log(auth.errorMessage)
        setOpenErrorModal(auth.errorMessage !== null)
    }, [auth]);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNavigateProfile = () => {
        props.changeLoc('/profile');
        handleProfileMenuClose();
        navigate("/profile");
        store.changePageToProfile();
    }

    const handleOpenLoginModal = () => {
        setOpenLoginModal(true)
    }

    const handleCloseLoginModal = () => {
        setOpenLoginModal(false)
    }

    const handleOpenRegisterModal = () => {
        setOpenRegisterModal(true)
    }

    const handleCloseRegisterModal = () => {
        setOpenRegisterModal(false)
    }

    const handleErrorModalClose = () => {
        auth.resetMessage();
        setOpenErrorModal(false);
    };

    const handleClosePasswordModal = () => {
        setOpenPasswordModal(false)
    }

    const handleOpenPasswordModal = () => {
        handleCloseLoginModal();
        setOpenPasswordModal(true)
    }

    const handleRegister = (event) => {
        event.preventDefault();
        handleCloseRegisterModal();

        const formData = new FormData(event.currentTarget);
        auth.registerUser({
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            userName: formData.get('userName'),
            password: formData.get('password'),
            passwordVerify: formData.get('passwordVerify')
        }, store);
    };

    const handleLogin = (event) => {
        event.preventDefault();
        handleCloseLoginModal()
        const data = new FormData(event.currentTarget);

        auth.loginUser({
            email: data.get('email'),
            password: data.get('password'),
        }, store, (loggedInUser) => {
            setUser(loggedInUser)
            setLoggedIn(true)
            props.changeLoc('/explore')
            store.changePageToExplore();
            navigate("/explore")
        });
    }

    const handleForgotPassword = (event) => {
        event.preventDefault();
        handleClosePasswordModal()
        const data = new FormData(event.currentTarget);

        auth.forgotPassword({
            email: data.get('email')
        });
    }

    const handleLogout = () => {
        handleProfileMenuClose();
        auth.logoutUser(store, () => {
            console.log("logout callback")
            setLoggedIn(false);
            props.changeLoc('/');
            navigate("/")
        });
    }

    const createLogo = () => {
        return (
            <div className='navbar_logo' >
                <img src={require('../images/logo512.png')}/>
            </div>
        )
    }


    const createAppButtons = (isLoggedIn) => {
        // if logged in, create 3 buttons for profile, explore, and community
        // make sure the buttons are next to each other
        // if not logged in, create 2 buttons for explore and community
        // make sure the buttons are next to each other
        if (isLoggedIn) {
            return (
                <>
                    <Box style={{
                        display: 'flex', flexDirection: 'row', marginRight: '10px', bottom: '0',
                        color: `${store.currentPage === 'explore' ? "#2dd4cf" : "white"}`
                    }} className='navbarappoptions-sections-box' onClick={() => {
                        props.changeLoc('/explore');
                        navigate("/explore"); store.changePageToExplore();
                    }}>
                        <ExploreIcon className='navbarappoptions-sections' sx={{ fontSize: 25, px: 1, pt: 1 }}></ExploreIcon>
                        <Typography fontSize='26px' className='navbarappoptions-sections'>Explore</Typography>
                    </Box>



                    <Box style={{
                        display: 'flex', flexDirection: 'row', marginRight: '10px', marginLeft: '10px', bottom: '0',
                        color: `${store.currentPage === 'library' ? "#2dd4cf" : "white"}`
                    }} className='navbarappoptions-sections-box' onClick={() => {
                        store.changePageToLibrary().then(()=> {props.changeLoc('/library'); navigate("/library");})
                    }}>
                        <CollectionsBookmarkIcon className='navbarappoptions-sections' sx={{ fontSize: 25, px: 1, pt: 1 }}></CollectionsBookmarkIcon>
                        <Typography fontSize='26px' className='navbarappoptions-sections'>Library</Typography>
                    </Box>


                    <Box style={{
                        display: 'flex', flexDirection: 'row', marginRight: '70px', marginLeft: '10px',
                        color: `${store.currentPage === 'community' ? "#2dd4cf" : "white"}`
                    }} className='navbarappoptions-sections-box' onClick={() => {
                        props.changeLoc('/community'); navigate("/community"); store.changePageToCommunity(); communityStore.getPopularThreads(1);
                    }}>
                        <PeopleIcon className='navbarappoptions-sections' sx={{ fontSize: 25, px: 1, pt: 1 }}></PeopleIcon>
                        <Typography fontSize='26px' className='navbarappoptions-sections'>Community</Typography>
                    </Box>
                </>
            )
        }
        else {
            return (
                <div></div>
            )
        }
    }


    const createLoginButtons = (isLoggedIn, loginFn) => {
        // If logged in, create avatar and notifications
        // If not logged in, create 2 buttons for login and signup

        if (isLoggedIn) {
            return (
                <>
                    {/* add user information once they are logged in here */}
                    <NotificationSidebar />
                    <Avatar src={auth.user?.profilePic?.url}
                        sx={{
                            width: 50,
                            height: 50,
                            fontSize: "20px",
                            bgcolor: "rgb(2, 0, 36)",
                            border: "rgba(59, 130, 206, 1) 2px solid",
                            cursor: "pointer",
                            marginRight: "30px"
                        }}
                        onClick={handleProfileMenuOpen}>
                        {auth.user?.firstName.charAt(0)}{auth.user?.lastName.charAt(0)}

                    </Avatar>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={isProfileMenuOpen}
                        onClose={handleProfileMenuClose}
                    >
                        <MenuItem
                            sx={{ width: "300px", height: "70px", textAlign: "center", fontSize: "25px" }}
                            onClick={handleNavigateProfile}
                        >
                            <ManageAccountsIcon sx={{ marginRight: "10px", fontSize: "35px" }} />
                            <div>Account Settings</div>
                        </MenuItem>

                        <MenuItem
                            sx={{ width: "300px", height: "70px", textAlign: "center", fontSize: "25px" }}
                            onClick={handleLogout}
                        >
                            <LogoutIcon sx={{ marginRight: "10px", fontSize: "30px" }} />
                            <div>Logout</div>
                        </MenuItem>
                    </Menu>
                </>
            )
        }
        else {
            return (
                <>
                    <Box style={{
                        display: 'flex', flexDirection: 'row', marginRight: '20px', bottom: '0',
                        color: `${store.currentPage === 'explore' ? "#2dd4cf" : "white"}`
                    }} className='navbarappoptions-sections-box' onClick={handleOpenLoginModal}>
                        <Typography fontSize='26px' className='navbarappoptions-sections'>Login</Typography>
                    </Box>
                    {/* TODO add a register onClick event */}
                    <Box style={{
                        display: 'flex', flexDirection: 'row', marginRight: '20px', bottom: '0',
                        color: `${store.currentPage === 'explore' ? "#2dd4cf" : "white"}`
                    }} className='navbarappoptions-sections-box' onClick={handleOpenRegisterModal}>
                        <Typography fontSize='26px' className='navbarappoptions-sections'>Register</Typography>
                    </Box>
                </>
            )
        }
    }




    const createSearchBar = () => {

        const handleSearchChange = (e) => {
            if (e.keyCode == 13) {
                store.changeSearchName(e.target.value)
            }
        }

        const createSearchIcon = () => {
            return (
                <InputAdornment position="end">
                    <SearchIcon sx={{ fontSize: 30, px: 1, color: 'rgba(200, 200, 200, 1)' }} />
                </InputAdornment>
            )
        }
        return auth.user ? (
            <>
                <WideInput placeholder="Search for maps and tilesets..." onKeyDown={handleSearchChange} endAdornment={createSearchIcon()} />
            </>
        ) : (<></>);
    }

    // console.log(props.reset)

    // return the logo, app buttons, and login buttons
    // the login buttons should be on the right side of the navbar
    // and everything else should be on the left side of the navbar
    return (
        <>
            <div className='navbar_appoptions'>
                {createLogo()}
                <div className='navbar_appflexbox'>
                    <div className='navbar_flexitem_left'>
                        {createAppButtons(auth.user? true: false)}
                    </div>
                    {createSearchBar()}
                    <div className='navbar_flexitem_right'>
                        {createLoginButtons(auth.user? true: false, setLoggedIn)}
                    </div>
                </div>

                <Modal
                    open={openLoginModal}
                    onClose={handleCloseLoginModal}
                >
                    <Box
                        borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='40%' top='30%' left='30%'
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: "white" }}
                    >

                        <Typography component="h1" variant="h5">
                            Login
                        </Typography>
                        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                            <TextField
                                style={{ color: "white" }}
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                InputLabelProps={{ style: { color: "white" } }}
                                sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" }, "& .MuiInputBase-root": { color: "azure" } }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                InputLabelProps={{ style: { color: "white" } }}
                                sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" }, "& .MuiInputBase-root": { color: "azure" } }}
                            />

                            <Button onClick={handleOpenPasswordModal}>
                                <Typography fontSize='1rem'>Forgot Password</Typography>
                            </Button>

                            <Button d
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Login
                            </Button>
                        </Box>
                    </Box>
                </Modal>


                <Modal
                    open={openRegisterModal}
                    onClose={handleCloseRegisterModal}
                >
                    <Box
                        borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='40%' top='30%' left='30%'
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: "white" }}
                    >

                        <Typography component="h1" variant="h5">
                            Register
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="fname"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        InputLabelProps={{ style: { color: "white" } }}
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" },
                                            "& .MuiInputBase-root": { color: "azure" }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="lname"
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
                                        id="userName"
                                        label="User Name"
                                        name="userName"
                                        autoComplete="userName"
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
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
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
                                        name="passwordVerify"
                                        label="Password Verify"
                                        type="password"
                                        id="passwordVerify"
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
                                Register
                            </Button>
                        </Box>
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
                            Reset Password
                        </Typography>
                        <Box component="form" onSubmit={handleForgotPassword} noValidate sx={{ mt: 1 }}>
                            <TextField
                                style={{ color: "white" }}
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                InputLabelProps={{ style: { color: "white" } }}
                                sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" }, "& .MuiInputBase-root": { color: "azure" } }}
                            />

                            <Button d
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Send Password Reset Email
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
        </>
    );
}
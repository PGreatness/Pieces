import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from "react";
import './css/navbarAppOptions.css';
import Box from '@mui/material/Box';

import { Input, InputAdornment, Typography } from '@mui/material';
import { styled } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import PeopleIcon from '@mui/icons-material/People';
import { Avatar } from "@mui/material";

import NotificationSidebar from '../NotificationSidebar/NotificationSidebar';
import { GlobalStoreContext } from '../../store/store'
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

    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = React.useState(false);


    const createLogo = () => {
        return (
            <div className='navbar_logo' onClick={() => { props.changeLoc('/'); navigate('/') }}>
            </div>
        )
    }

    useEffect(() => {
        auth.getLoggedIn(store);
        console.log(auth.user)
        if (auth.user == null) {
            setLoggedIn(false);
        } else {
            props.changeLoc('/explore')
            setLoggedIn(true);
            navigate("/explore")
        }

    }, []);


    const handleLogin = () => {
        props.changeLoc('/explore')

        auth.loginUser({
            userName: 'iman123',
            password: 'iman1234',
        }, store);

        setLoggedIn(true)
        store.changePageToExplore();
        navigate("/explore")
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
                        display: 'flex', flexDirection: 'row', marginRight: '10px',
                        color: `${store.currentPage === 'explore' ? "#2dd4cf" : "white"}`
                    }} onClick={() => {
                        props.changeLoc('/explore');
                        navigate("/explore"); store.changePageToExplore();
                    }}>
                        <ExploreIcon sx={{ fontSize: 29, px: 1, pt: 1 }}></ExploreIcon>
                        <Typography fontSize='26px'>Explore</Typography>
                    </Box>



                    <Box style={{
                        display: 'flex', flexDirection: 'row', marginRight: '10px', marginLeft: '10px',
                        color: `${store.currentPage === 'library' ? "#2dd4cf" : "white"}`
                    }} onClick={() => {
                        props.changeLoc('/library'); navigate("/library"); store.changePageToLibrary();
                    }}>
                        <CollectionsBookmarkIcon sx={{ fontSize: 25, px: 1, pt: 1 }}></CollectionsBookmarkIcon>
                        <Typography fontSize='26px'>Library</Typography>
                    </Box>


                    <Box style={{
                        display: 'flex', flexDirection: 'row', marginRight: '70px', marginLeft: '10px',
                        color: `${store.currentPage === 'community' ? "#2dd4cf" : "white"}`
                    }} onClick={() => {
                        props.changeLoc('/community'); navigate("/community"); store.changePageToCommunity();
                    }}>
                        <PeopleIcon sx={{ fontSize: 29, px: 1, pt: 1 }}></PeopleIcon>
                        <Typography fontSize='26px'>Community</Typography>
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
        // if logged in, create a button for library
        // if not logged in, create 2 buttons for login and signup
        // make sure the buttons are next to each other
        if (isLoggedIn) {
            return (
                <>
                    {/* add user information once they are logged in here */}
                    <NotificationSidebar />
                    <Avatar
                        sx={{
                            width: 50,
                            height: 50,
                            fontSize: "20px",
                            bgcolor: "rgb(2, 0, 36)",
                            border: "rgba(59, 130, 206, 1) 2px solid",
                            cursor: "pointer",
                            marginRight: "30px"
                        }}
                        onClick={() => {
                            props.changeLoc('/profile'); navigate("/profile"); store.changePageToProfile();
                        }}>
                        IA
                    </Avatar>
                </>
            )
        }
        else {
            return (
                <>
                    <h1 onClick={handleLogin}>Login</h1>
                    <h1>Signup</h1>
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
        return loggedIn ? (
            <>
                <WideInput placeholder="Search for maps and tilesets..." onKeyDown={handleSearchChange} endAdornment={createSearchIcon()} />
            </>
        ) : (<></>);
    }

    // return the logo, app buttons, and login buttons
    // the login buttons should be on the right side of the navbar
    // and everything else should be on the left side of the navbar
    return (
        <>
            <div className='navbar_appoptions'>
                {createLogo()}
                <div className='navbar_appflexbox'>
                    <div className='navbar_flexitem_left'>
                        {createAppButtons(loggedIn)}
                    </div>
                    {createSearchBar()}
                    <div className='navbar_flexitem_right'>
                        {createLoginButtons(loggedIn, setLoggedIn)}
                    </div>
                </div>
            </div>
        </>
    );
}
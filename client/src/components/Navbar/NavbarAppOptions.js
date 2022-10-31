import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/navbarAppOptions.css';

import { Input, InputAdornment } from '@mui/material';
import { styled } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

export default function NavbarAppOptions(props) {

    const WideInput = styled(Input)({
        width: '100%',
        backgroundColor: 'rgba(155, 155, 155, 0.70)',
        borderRadius: '4px',
        height: '50%'
    });
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = React.useState(false);
    const createLogo = () => {
        return (
            <div className='navbar_logo' onClick={()=>{props.changeLoc('/');navigate('/')}}>
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
                    <h1 onClick={() => {props.changeLoc('/explore');navigate("/explore")}} >Explore</h1>
                    <h1 onClick={() => {props.changeLoc('/library');navigate("/library")}} >Library</h1>
                    <h1 onClick={() => {props.changeLoc('/community');navigate("/community")}} >Community</h1>
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
                    <h1 onClick={() => {props.changeLoc('/profile');navigate("/profile")}} >Profile</h1>
                </>
            )
        }
        else {
            return (
                <>
                    <h1 onClick={()=>loginFn(true)}>Login</h1>
                    <h1>Signup</h1>
                </>
            )
        }
    }

    const createSearchBar = () => {
        const createSearchIcon = () => {
            return (
                <InputAdornment position="start">
                    <SearchIcon sx={{color:'rgba(200, 200, 200, 1)'}}/>
                </InputAdornment>
            )
        }
        return loggedIn ? (
            <>
                <WideInput placeholder="Search" startAdornment={createSearchIcon()}/>
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
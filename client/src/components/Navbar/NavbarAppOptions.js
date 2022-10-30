import React from 'react';
import { useNavigate } from 'react-router-dom';
import './../css/navbarAppOptions.css';

export default function NavbarAppOptions() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = React.useState(false);
    const createLogo = () => {
        return (
            <div className='navbar_logo'>
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
                    <h1 onClick={() => { navigate("/explore")}} >Explore</h1>
                    <h1 onClick={() => { navigate("/library")}} >Library</h1>
                    <h1 onClick={() => { navigate("/community")}} >Community</h1>
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
        console.log(isLoggedIn);
        if (isLoggedIn) {
            return (
                <>
                    <h1 onClick={() => { navigate("/profile")}} >Profile</h1>
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
                <div className='navbar_flexitem_right'>
                    {createLoginButtons(loggedIn, setLoggedIn)}
                </div>
            </div>
        </div>
        </>
    );
}
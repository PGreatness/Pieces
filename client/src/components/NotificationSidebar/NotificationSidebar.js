import React from 'react';
import { useRef, useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './css/notificationSidebar.css';
import NotificationList from './NotificationList';
import AuthContext from '../../auth/auth';

const startAnimation = () => {
    let target = document.getElementsByClassName('notification-sidebar-cover')[0];
    // start the animation
    target.classList.add('slide-out');
}

const endAnimation = () => {
    let target = document.getElementsByClassName('notification-sidebar-cover')[0];
    // end the animation
    target.classList.remove('slide-out');
}

// props.user is the currently logged in user object
export default function NotificationSidebar(props) {

    const { auth } = useContext(AuthContext);
    const [open, setOpen] = React.useState(false);
    const containerRef = useRef(null);
    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        startAnimation();
    };

    const toggler = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        // get the name of the animation
        if (event.animationName?.toLowerCase().includes('reset')) {
            return;
        }

        if (!open) {
            endAnimation();
        }
        setOpen(open);
    };


    return (
        <>
            <IconButton className='notification-open-button' onClick={toggleDrawer(true)} >
                <NotificationsIcon sx={{ color: 'white', fill: 'white', fontSize: 30, px: 1 }} />
            </IconButton>
            <div className='notification-sidebar-cover' onAnimationEnd={toggler(true)} ref={containerRef}></div>
            <Drawer anchor="right" open={open} onClose={toggler(false)} transitionDuration={{ enter: 0.1, exit: 500 }} PaperProps={{ sx: { backgroundColor: '#11182A' } }}>
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                >
                    <NotificationList notifications={auth.user?.notifications}/>
                </Box>
            </Drawer>
        </>
    );
}
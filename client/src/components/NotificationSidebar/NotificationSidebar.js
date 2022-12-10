import React from 'react';
import { useRef, useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import './css/notificationSidebar.css';
import NotificationList from './NotificationList';
import AuthContext from '../../auth/auth';
import { Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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

    const [open, setOpen] = useState(false);
    const [notifs, setNotifs] = useState(auth.user?.notifications.sort(function(x, y){
        return new Date(y.sentAt) - new Date(x.sentAt);
    }));
    const [anchorEl, setAnchorEl] = useState(null);
    const isOptionsMenuOpen = Boolean(anchorEl);
    const [unseen, setUnseen] = useState(auth.user?.notifications.some(notif => notif.seen === false));

    // console.log(auth.socket)
        // Add an event listener for the "updateNotifications" event
        auth.socket?.on("updateNotifications", (data) => {
            // If the event was not emitted by the current socket, continue as usual
            console.log("Updating event")
            auth.getUserById(auth.user?._id, (user) => {
                console.log(user.notifications)
                setNotifs(user.notifications.sort(function(x, y){
                    return new Date(y.sentAt) - new Date(x.sentAt);
                }))
                setUnseen(user.notifications.some(notif => notif.seen === false))
            })
        })

        auth.socket?.on("updateNotification", (data) => {
            console.log("i'm in updateNotification")
        })

    const updateNotifications = (newNotifications, data) => {
        setNotifs(newNotifications);
        if (data) {
            console.log("emitting friendRequestAction event from updateNotifications")
            auth.socket?.emit("friendRequestAction", data);
        }
    }

    const handleOptionsMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleOptionsMenuClose = () => {
        setAnchorEl(null);
    };

    const handleClearAll = () => {
        handleOptionsMenuClose();
        // call auth function
        auth.removeAllNotifications(auth.user?._id, (updatedUser) => {
            updateNotifications(updatedUser.notifications)
            setUnseen(false)
            console.log(updatedUser)
        })
    };

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

        // TODO: if closing notifications, make sure all are seen! call controller function here
        if (!open) {
            endAnimation();
            // call auth function to make all seen
            auth.markAllSeen(auth.user?._id, (updatedUser) => {
                updateNotifications(updatedUser.notifications)
                setUnseen(false)
            })
        }
        setOpen(open);
    };


    return (
        <>
            <IconButton className='notification-open-button' onClick={toggleDrawer(true)} >
                <NotificationsIcon sx={{ color: 'white', fill: unseen? '#D0342C': 'white', fontSize: 35, px: 1.5 }} />
            </IconButton>
            <div className='notification-sidebar-cover' onAnimationEnd={toggler(true)} ref={containerRef}></div>
            <Drawer anchor="right" open={open} onClose={toggler(false)} transitionDuration={{ enter: 0.1, exit: 500 }} PaperProps={{ sx: { backgroundColor: '#11182A' } }}>
                <Box
                    sx={{ width: 400, display: 'flex', flexDirection: 'column', height: '100vh !important', }}
                    role="presentation"
                >
                    <Box sx={{ display: 'flex', flexDirection: 'row', paddingTop: "40px", 
                                paddingBottom: "30px", paddingLeft: "30px" }} borderBottom={3}>
                        <Typography component="h1" variant="h4">Notifications</Typography>
                        <MoreHorizIcon 
                            sx={{ color: 'white', fill: 'white', fontSize: 40, paddingLeft: "100px", paddingTop: "3px" }}
                            onClick={handleOptionsMenuOpen}
                        /> 
                    </Box>
                    
                    <NotificationList notifs={notifs} updateNotifications={updateNotifications}/>
                </Box>
            </Drawer>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isOptionsMenuOpen}
                onClose={handleOptionsMenuClose}
            >
                <MenuItem onClick={handleClearAll}>Clear All</MenuItem>
            </Menu>
        </>
    );
}
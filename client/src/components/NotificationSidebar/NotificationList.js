import React from 'react';
import { Stack } from '@mui/material';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import Slide from '@mui/material/Slide';
import { useState } from 'react';
import noNotifications from '../images/mindful.png';
import './css/notificationList.css';

import Notification from './Notification';
// props.user is the currently logged in user object
// user has the following properties:
// id, firstName, lastName, userName, email, passwordHash, notifications, profilePic, bio, friends, chats
// props.user is null if no user is logged in
// props.changeLoc is a function that takes in a string and changes the location of the app
// notifications is an array of Notification objects
export default function NotificationList(props) {

    const [notifs, setNotifs] = useState(props.notifications);

    const addNotification = (notif) => {
        setNotifs([...notifs, notif]);
    }

    const removeNotification = (notifId) => {
        // filter out the notification with the given id
        setNotifs(notifs.filter(notif => notif._id !== notifId));
    }

    // return the list of notifications in a stack with spacing of 2 between each notification

    return (
        <Stack spacing={2}>
            <TransitionGroup>
                {
                    notifs?.length ? notifs.map(notif => (
                        <Slide direction="up" key={notif._id} in={notifs[notif._id]} mountOnEnter unmountOnExit timeout={{ enter: 500, exit: 500 }}>
                            <div>
                                <Notification key={notif._id} notification={notif} swipeAway={removeNotification} />
                            </div>
                        </Slide>
                    )) :
                        <Slide direction="up" in={true} mountOnEnter timeout={{ enter: 1000, exit: 500 }}>
                            <div className='notification-list-no-notifications'>
                                <img src={noNotifications} alt='No Notification!' />
                                <h1>No Notifications</h1>
                            </div>
                        </Slide>
                }
            </TransitionGroup>
        </Stack>
    );
}
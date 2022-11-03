import React from 'react';
import { ObjectId } from 'mongoose';
import { ListItemButton, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// props.user is the currently logged in user object
// user has the following properties:
// id, firstName, lastName, userName, email, passwordHash, notifications, profilePic, bio, friends, chats
// props.user is null if no user is logged in
// notification has the following properties:
// id, senderId, seen, notificationMsg, sentAt
// props.from is the id of the user who sent the notification or null if the notification is from the app
export default function Notification(props) {

    const [notif, setNotif] = React.useState({
        _id: props.notification._id,
        senderId: props.notification.senderId,
        seen: props.notification.seen,
        notificationMsg: props.notification.notificationMsg,
        sentAt: props.notification.sentAt
    });

    const markAsSeen = () => {
        props.swipeAway(notif._id);
        setNotif({ ...notif, seen: true });
    }

    const createNotification = () => {
        let notifAvatar = null;
        // if the notification is from a user, create an avatar with their profile picture
        // by pinging the server for the user's profile picture
        // if the notification is from the app, create an avatar with the app logo
        if (notif.senderId) {
            // ping the server but for now use dummy data
            // data = response.json().userName;
            const data = 'username';
            notifAvatar = <Avatar src='https://i.imgur.com/0y0y0y0.png' alt={data}>{data.charAt(0)}</Avatar>;
        } else {
            notifAvatar = <Avatar src='https://i.imgur.com/0y0y0y0.png' alt='App Logo'>A</Avatar>;
        }

        // create the notification with the avatar, the message, a timestamp, and a button to mark the notification as seen
        return (
            <>
                <ListItemButton>
                    <ListItemAvatar>
                        {notifAvatar}
                    </ListItemAvatar>
                    <ListItemText primary={notif.notificationMsg} secondary={notif.sentAt} primaryTypographyProps={{ style: { color: 'white' } }} secondaryTypographyProps={{ style: { color: 'whitesmoke' } }} />
                </ListItemButton>
                <ListItemButton onClick={markAsSeen}>
                    <CheckCircleIcon sx={{ color: 'white', fill: "white" }} />
                </ListItemButton>
            </>
        );
    }

    return (
        <div>
            {createNotification()}
        </div>
    );
}
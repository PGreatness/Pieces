import React from 'react';
import { ObjectId } from 'mongoose';
import { useState, useContext, useEffect } from "react";
import { ListItemButton, ListItemAvatar, Avatar, ListItemText, ListItem } from '@mui/material';
import ReactTimeAgo from 'react-time-ago';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Clear } from '@mui/icons-material'
import { GlobalStoreContext } from '../../store/store';
import AuthContext from '../../auth/auth';
// props.user is the currently logged in user object
// user has the following properties:
// id, firstName, lastName, userName, email, passwordHash, notifications, profilePic, bio, friends, chats
// props.user is null if no user is logged in
// notification has the following properties:
// id, senderId, seen, notificationMsg, sentAt
// props.from is the id of the user who sent the notification or null if the notification is from the app
export default function Notification(props) {

    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const [notif, setNotif] = React.useState({
        _id: props.notification._id,
        senderId: props.notification.senderId,
        seen: props.notification.seen,
        notificationMsg: props.notification.notificationMsg,
        sentAt: props.notification.sentAt
    });
    const [sender, setSender] = useState(null)

    useEffect(() => {
        auth.getUserById(notif.senderId, (sender) => {
            console.log(sender)
            setSender(sender)
        })
    }, [])


    const deleteNotification = () => {
        auth.removeNotification(props.notification._id, auth.user?._id, (updatedUser) => {
            props.updateNotifs(updatedUser.notifications)
        })
    }


    const approve = () => {
        if (notif.notificationMsg.includes("map")) {

            // add collaborator
            store.addMapCollaborator(props.notification.mapId, props.notification.senderId)
                .then(() => {

                    // remove notification
                    auth.removeNotification(props.notification._id, auth.user?._id, (updatedUser) => {

                        // add new Notification to let users know a collaborator added
                        auth.mapActionNotification(auth.user?._id, props.notification.senderId,
                            props.notification.mapId, (newUser) => {
                                props.updateNotifs(newUser.notifications)
                            })

                    })
                })
                .catch((err) => console.log(err))

        } else if (notif.notificationMsg.includes("tileset")) {
            console.log(props.notification)

            // add collaborator
            store.addTilesetCollaborator(props.notification.tilesetId, props.notification.senderId)
                .then(() => {

                    // remove notification
                    auth.removeNotification(props.notification._id, auth.user?._id, (updatedUser) => {

                        // add new Notification to let users know a collaborator added
                        auth.tilesetActionNotification(auth.user?._id, props.notification.senderId,
                            props.notification.tilesetId, (newUser) => {
                                props.updateNotifs(newUser.notifications)
                            })
                    })
                })
                .catch((err) => console.log(err))

        } else {
            // friend request case
            auth.socket.emit('friendRequestAction', { sendTo: props.notification.senderId, action: 'approve' })
            // add friend
            auth.addFriend(auth.user?._id, props.notification.senderId, (user) => {

                    // remove notification
                    auth.removeNotification(props.notification._id, auth.user?._id, (updatedUser) => {

                        // add new Notification to let users know a collaborator added
                        auth.approveFriendRequest(props.notification.senderId, auth.user?._id,
                            (newUser) => {
                                props.updateNotifs(newUser.notifications)
                            })

                    })

            }).catch((err) => console.log(err))

        }
    }



    const deny = () => {
        
        if (notif.notificationMsg.includes("map")) {

            // remove notification
            auth.removeNotification(props.notification._id, auth.user?._id, (updatedUser) => {

                // add new Notification to let users know a collaborator added
                auth.mapDenyNotification(auth.user?._id, props.notification.senderId,
                    props.notification.mapId, (newUser) => {
                        props.updateNotifs(newUser.notifications)
                    })

            })

        } else if (notif.notificationMsg.includes("tileset")) {

            // remove notification
            auth.removeNotification(props.notification._id, auth.user?._id, (updatedUser) => {

                // add new Notification to let users know a collaborator added
                auth.tilesetDenyNotification(auth.user?._id, props.notification.senderId,
                    props.notification.tilesetId, (newUser) => {
                        props.updateNotifs(newUser.notifications)
                    })

            })

        } else {
            // friend request case
            auth.socket.emit('friendRequestAction', { sendTo: props.notification.senderId, action: 'deny' })
            // remove notification
            auth.removeNotification(props.notification._id, auth.user?._id, (updatedUser) => {

                // add new Notification to let users know a collaborator added
                auth.denyFriendRequest(props.notification.senderId, auth.user?._id, 
                    (newUser) => {
                        props.updateNotifs(newUser.notifications)
                    })

            })

        }
    }

    const getAvatar = () => {
        let notifAvatar = null;
        // if the notification is from a user, create an avatar with their profile picture
        // by pinging the server for the user's profile picture
        // if the notification is from the app, create an avatar with the app logo
        if (notif.senderId) {
            notifAvatar = <Avatar src={sender?.profilePic?.url}
                sx={{
                    width: 70,
                    height: 70,
                    fontSize: "20px",
                    bgcolor: "black",
                    color: "white",
                    cursor: "pointer",
                    marginRight: "12px"
                }}>
                {sender?.firstName.charAt(0)}{sender?.lastName.charAt(0)}
            </Avatar>

        } else {
            notifAvatar = <Avatar src='https://i.imgur.com/0y0y0y0.png' alt='App Logo'>A</Avatar>
        }

        return (notifAvatar)

    }



    return (
        <div>
            <ListItemButton style={{ backgroundColor: props.notification.seen? "rgb(217, 217, 217, 0.25" : "rgb(217, 217, 217, 0.45", 
                margin: "10px", borderRadius: "15px" }}>
                <ListItemAvatar sx={{ height: '90%' }}>
                    {getAvatar()}
                </ListItemAvatar>
                <ListItem style={{ display: "flex", flexDirection: "column" }}>
                    <Clear
                        sx={{ color: 'rgb(0,0,0,0.7)', marginLeft: 'auto' }}
                        onClick={deleteNotification}
                    ></Clear>
                    <ListItemText primary={notif.notificationMsg}
                        primaryTypographyProps={{ style: { color: 'black', fontSize: "20px" } }}
                    />
                    {props.notification.action ?
                        <ListItem style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <CheckCircleIcon
                                sx={{ fill: '#4bcb50', fontSize: 50, paddingTop: "3px" }}
                                onClick={approve}
                            />
                            <CancelIcon
                                sx={{ fill: '#e52727', fontSize: 50, paddingLeft: "20px", paddingTop: "3px" }} 
                                onClick={deny}
                            />
                        </ListItem>
                        : <></>}
                    <ListItemText primary={notif.sentAt}
                        primaryTypographyProps={{ style: { color: 'rgb(0,0,0,0.6)', paddingTop: "5px" } }}
                    />
                </ListItem>
            </ListItemButton>

        </div>
    );
}
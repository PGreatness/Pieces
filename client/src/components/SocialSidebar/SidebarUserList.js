import React from 'react';
import SidebarUser from './SidebarUser';
import api from '../../api/api'
import AuthContext from '../../auth/auth';

import { List } from '@mui/material';

export default function SidebarUserList(props) {

    const { auth } = React.useContext(AuthContext);

    const [searchedUser, setSearchedUser] = React.useState(props.query);
    const [currentUser, setCurrentUser] = React.useState(props.ownerId);
    const [isPendingList, setIsPendingList] = React.useState([]);

    const [friendsList, setFriendsList] = React.useState([]);
    const [searchList, setSearchList] = React.useState([]);

    // console.log(auth.socket)
    auth.socket.on('friendRequestResponse', (data) => {
        console.log("friend Request Response")
        console.log(data)
        if (data.action === 'approve') {
            console.log("approve")
            getAllFriends(props.ownerId);
        } else if (data.action === 'deny') {
            console.log("reject")
            setIsPendingList(isPendingList.filter((id) => id !== data.from))
        }
        auth.socket.emit('requestUpdate', { sendTo: data.from })
    })

    React.useEffect(() => {
        getAllFriends(props.ownerId);
    }, []);

    React.useEffect(() => {
        setCurrentUser(props.ownerId);
        getAllFriends(props.ownerId);
    }, [props.ownerId]);

    const getAllFriends = async function (id) {
        const response = await api.getUserFriends(id);


        // console.log("FRIENDS RESPONSE")
        // console.log(response)
        if (response.data.success) {
            console.log("friends are here")
            setFriendsList(response.data.friends)
            // console.log(response)
        }

        // console.log("????")
        // // console.log(response.friends)
        // return response.data.friends

    }

    const getAllSearchedUsers = async () => {
        const response = await api.getUsersByUsername(props.query);
        // const response = await fetch(`/api/users/${searchedUser}`);
        // const data = await response.json();
        // const response = {
        //     "users": [
        //         {
        //             "id": 1,
        //             "username": "John Stwart",
        //             "email": "test@test.com",
        //             "profilePic": "https://i.imgur.com/0s3pdnc.png",
        //             "bio": "I am a test user",
        //             "firstName": "John",
        //             "lastName": "Stwart"
        //         },
        //         {
        //             "id": 7,
        //             "username": "John Johnson",
        //             "email": "test@test.com",
        //             "bio": "I am a test user",
        //             "firstName": "John",
        //             "lastName": "Johnson"
        //         }
        //     ]
        // };
        if (response.data.success) {
            // console.log("user search is here")
            // console.log(response)
            setSearchList(response.data.users)
        }
    }

    if (!props.query) {
        // getAllFriends();
        return (
            <div className="sidebar-user-list">
                {
                    friendsList.map((user) => {
                        return (
                            <SidebarUser user={user} isFriend={true} isOnline={true} key={user._id} />
                        )
                    })
                }
            </div>
        );
    }
    getAllSearchedUsers()
    return (
        <List sx={{ backgroundColor: '#11182A' }}>
            {
                searchList.map((user) => {
                    return (
                        <>
                            {/* <SidebarUser user={user} isFriend={false} isOnline={false} key={user.id}/> */}
                            <SidebarUser pending={isPendingList.includes(user._id)} user={user} isFriend={friendsList.includes(user)} isOnline={true} key={user.id + 1} addPending={(id) => setIsPendingList([...isPendingList, id])} />
                            {/* remove the last one during non static trials */}
                        </>
                    );
                })
            }
        </List>
    );
}
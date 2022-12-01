import React from 'react';
import SidebarUser from './SidebarUser';
import api from '../../api/api'

import { List } from '@mui/material';

export default function SidebarUserList(props) {

    const [searchedUser, setSearchedUser] = React.useState(props.query);
    const [currentUser, setCurrentUser] = React.useState(props.ownerId);

    const [friendsList, setFriendsList] = React.useState([]);
    const [searchList, setSearchList] = React.useState([]);

    const getAllFriends = async function () {
        const response = await api.getUserFriends(props.ownerId);
        // await fetch(`/getFriends/userId/${currentUser}/`);
        // const response = {
        //     "friends": [
        //         {
        //             "id": 1,
        //             "username": "test1",
        //             "email": "test@test.com",
        //             "profilePic": "https://i.imgur.com/0s3pdnc.png",
        //             "bio": "I am a test user",
        //             "firstName": "Test",
        //             "lastName": "User"
        //             // User Objects with all the friends of the user
        //         },
        //         {
        //             "id": 2,
        //             "username": "test2",
        //             "email": "test@test.com",
        //             "bio": "I am a test user",
        //             "firstName": "Randy",
        //             "lastName": "Orton"
        //         }
        //     ]
        // };

        
        if (response.data.success) {
            // console.log("friends are here")
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
        getAllFriends()
        return (
            <div className="sidebar-user-list">
                {
                friendsList.map((user) => {
                    return (
                        <SidebarUser user={user} isFriend={true} isOnline={true} key={user.id} />
                    )
                })
                }
            </div>
        );
    }
    getAllSearchedUsers()
    return (
        <List sx={{backgroundColor: '#11182A'}}>
            {
            searchList.map((user) => {
                return (
                    <>
                        {/* <SidebarUser user={user} isFriend={false} isOnline={false} key={user.id}/> */}
                        <SidebarUser user={user} isFriend={friendsList.includes(user)} isOnline={true} key={user.id + 1}/>
                        {/* remove the last one during non static trials */}
                    </>
                );
            })
            }
        </List>
    );
}
import React from 'react';
import SidebarUser from './SidebarUser';

import { List } from '@mui/material';

export default function SidebarUserList(props) {

    const [searchedUser, setSearchedUser] = React.useState(props.username);
    const [currentUser, setCurrentUser] = React.useState(props.ownerId);

    const getAllFriends = () => {
        // const response = await fetch(`/api/users/${currentUser}/friends`);
        // const data = await response.json();
        const response = {
            "friends": [
                {
                    "id": 1,
                    "username": "test1",
                    "email": "test@test.com",
                    "profilePic": "https://i.imgur.com/0s3pdnc.png",
                    "bio": "I am a test user",
                    "firstName": "Test",
                    "lastName": "User"
                    // User Objects with all the friends of the user
                },
                {
                    "id": 2,
                    "username": "test2",
                    "email": "test@test.com",
                    "bio": "I am a test user",
                    "firstName": "Randy",
                    "lastName": "Orton"
                }
            ]
        };
        const data = response; // await response.json();
        return data;
    }

    const getAllSearchedUsers = () => {
        // const response = await fetch(`/api/users/${searchedUser}`);
        // const data = await response.json();
        const response = {
            "users": [
                {
                    "id": 1,
                    "username": "John Stwart",
                    "email": "test@test.com",
                    "profilePic": "https://i.imgur.com/0s3pdnc.png",
                    "bio": "I am a test user",
                    "firstName": "John",
                    "lastName": "Stwart"
                },
                {
                    "id": 7,
                    "username": "John Johnson",
                    "email": "test@test.com",
                    "bio": "I am a test user",
                    "firstName": "John",
                    "lastName": "Johnson"
                }
            ]
        };
        const data = response; // await response.json();
        return data;
    }

    if (!props.username) {
        return (
            <div className="sidebar-user-list">
                {getAllFriends().friends.map((user) => {
                    return (
                        <SidebarUser user={user} isFriend={true} isOnline={true} key={user.id}/>
                    )
                })
            }
            </div>
        );
    }
    return (
        <List sx={{backgroundColor: '#11182A'}}>
            {
            getAllSearchedUsers().users.map((user) => {
                return (
                    <>
                        <SidebarUser user={user} isFriend={false} isOnline={false} key={user.id}/>
                        <SidebarUser user={user} isFriend={true} isOnline={true} key={user.id + 1}/>
                        {/* remove the last one during non static trials */}
                    </>
                );
            })
            }
        </List>
    );
}
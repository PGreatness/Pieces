import { styled } from '@mui/material';
import { React, useState, useContext, useEffect } from 'react';
import SidebarUserList from './SidebarUserList';

import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Input, InputAdornment } from '@mui/material';
import './css/SocialSidebar.css';
import AuthContext from '../../auth/auth';

const SearchBarWhite = styled(Input)({
    color: "white",
    backgroundColor: 'rgba(155, 155, 155, 0.70)',
    borderRadius: '4px',
});

export default function SocialSidebar(props) {
    const { auth } = useContext(AuthContext);
    const [searching, setSearching] = useState("");
    const [id, setId] = useState('');
    useEffect(() => {
        if (auth.user) {
            setId(auth.user._id);
        }
    }, [auth.user]);

    // const search = createSearchButton();

    const createSearchButton = () => {
        return (
            <InputAdornment position="end">
                <IconButton sx={{ color: 'white' }} onClick={() => { handleSearch() }}><SearchIcon /></IconButton>
            </InputAdornment>
        );
    }

    const handleSearch = () => {
        let query = document.getElementById('search_query').value
        setSearching(query)
    }

    const handleSearchChange = (e) => {
        if (e.keyCode == 13) {
            handleSearch()
        }
    }

    return (
        <div className='sidebar-container-container'>

            <div className='sidebar-container'>
                <div className='sidebar-search'>
                    <SearchBarWhite id="search_query" placeholder="Search" fullWidth className='sidebar-search-bar' endAdornment={createSearchButton()} onKeyDown={handleSearchChange} />
                </div>
                <div>
                    <SidebarUserList ownerId={id} query={searching} />
                </div>
            </div>
        </div>
    )
}
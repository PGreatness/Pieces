import { styled } from '@mui/material';
import React from 'react';
import SidebarUserList from './SidebarUserList';

import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Input, InputAdornment } from '@mui/material';
import './css/SocialSidebar.css';

const SearchBarWhite = styled(Input)({
    color: "white",
    backgroundColor: 'rgba(155, 155, 155, 0.70)',
    borderRadius: '4px',
});

const createSearchButton = () => {
    return (
        <InputAdornment position="end">
            <IconButton sx={{color:'white'}}><SearchIcon /></IconButton>
        </InputAdornment>
    );
}


export default function SocialSidebar(props) {
    const search = createSearchButton();
    return (
        <div className='sidebar-container-container'>

        <div className='sidebar-container'>
            <div className='sidebar-search'>
                <SearchBarWhite placeholder="Search" fullWidth className='sidebar-search-bar' endAdornment={search}/>
            </div>
            <div>
                <SidebarUserList ownerId={props.id} username="John"/>
            </div>
        </div>
        </div>
    )
}
import { React, useState } from "react";


import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Input, InputAdornment } from '@mui/material';
import { styled } from "@mui/material";

import PostListSidebar from "./PostListSidebar";
import './css/myPostsSidebar.css';

const SearchBarWhite = styled(Input)({
    color: "white",
    // search bar underline color
    '&::after': {
        borderBottomColor: 'white',
    },
    backgroundColor: 'rgba(155, 155, 155, 0.70)',
    borderRadius: '0px 4px 4px 0px',
});

const createSearchButton = () => {
    return (
        <InputAdornment position="end">
            <IconButton sx={{color:'white'}}><SearchIcon /></IconButton>
        </InputAdornment>
    );
}

export default function MyPostsSidebar() {
    const [searchText, setSearchText] = useState('');
    return (
        <div className='myposts-sidebar-container'>
            <div className='myposts-sidebar-search'>
                <SearchBarWhite placeholder="Search" fullWidth className='sidebar-search-bar' endAdornment={createSearchButton()} onChange={(e)=>setSearchText(e.target.value)}/>
            </div>
            <div className='myposts-sidebar-list'>
                <PostListSidebar filter={searchText}/>
            </div>
        </div>
    );
}
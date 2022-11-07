import React from 'react';
import { useState, useContext } from "react";
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

const StyledPagination = styled(Pagination)({
    '& .MuiPaginationItem-root': {
        color: 'white',
    },
    '& .MuiPaginationItem-page.Mui-selected': {
        backgroundColor: '#11182A',
    },
});
export default function MakePaginations(props) {
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
        // TODO: render new projects based on page number
    };
    return (
        <Box sx={{
            display: 'flex', justifyContent: 'center', position: 'sticky', bottom: '0',
            color: 'white', backgroundColor: '#1F293A', width: '80vw'
        }}>
            <StyledPagination count={props.count} page={page} onChange={handleChange}/>
        </Box>
    )
}
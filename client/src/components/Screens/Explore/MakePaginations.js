import React from 'react';
import { useState, useContext } from "react";
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';

const StyledPagination = styled(TablePagination)({
    '& .MuiPaginationItem-root': {
        color: 'white',
    },
    '& .MuiPaginationItem-page.Mui-selected': {
        backgroundColor: '#11182A',
    },
    '& .MuiTablePagination-displayedRows': {
        color: 'white',
    },
    '& .MuiTablePagination-selectLabel': {
        color: 'white',
    },
    '& .MuiTablePagination-select': {
        color: 'white',
    },
    '& .MuiTablePagination-selectIcon': {
        color: 'white',
    },
    '& .MuiIconButton-root': {
        color: 'white',
    },
    '& .MuiIconButton-root.Mui-disabled': {
        color: 'rgb(100, 100, 100)',
    },
});
export default function MakePaginations(props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleRowChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        // TODO: render new projects based on page number
    };
    return (
        <Box sx={{
            display: 'flex', justifyContent: 'center', position: 'sticky', bottom: '0',
            color: 'white', backgroundColor: '#1F293A', width: '80vw'
        }}>
            <StyledPagination count={props.count} page={page} onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage} onRowsPerPageChange={handleRowChange} labelRowsPerPage={'Public Projects Per Page'}/>
        </Box>
    )
}
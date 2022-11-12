import React from 'react';
import { useState, useContext, useEffect } from "react";
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import { GlobalStoreContext } from '../../../store/store';

const StyledPagination = styled(TablePagination)({
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
    const { store } = useContext(GlobalStoreContext);
    const [rowsPerPage, setRowsPerPage] = useState(store.pagination.limit);

    useEffect(() => {setPage(0)}, [store.pagination.sort, store.pagination.order]);

    const handleRowChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        store.changePagination(0, parseInt(event.target.value, 10));
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        store.changePagination(value, rowsPerPage);
    };
    return (
        <Box sx={{
            display: 'flex', justifyContent: 'center', bottom: '0',
            color: 'white', backgroundColor: '#1F293A', width: '75vw'
        }}>
            <StyledPagination count={-1} page={page} onPageChange={handlePageChange} labelDisplayedRows={()=>''}
            rowsPerPage={rowsPerPage} onRowsPerPageChange={handleRowChange} labelRowsPerPage={'Projects Per Page'}
            nextIconButtonProps={{disabled: store.pagination.stopPagination}}/>
        </Box>
    )
}
import React from 'react';
import '../css/mapeditor.css'
import '../css/tileseteditor.css'
import { Box, Stack } from '@mui/system';
import MapToolBar from './MapToolBar';
import MapCanvas from './MapCanvas';
import MapRightBar from './MapRightBar';

export default function MapEditor() {
    return (
        <Box bgcolor={"#1f293a"}>
            <Stack direction="row" justifyContent='space-between'>
                <MapToolBar/>
                <MapCanvas/>
                <MapRightBar/>
            </Stack>
        </Box>
    );
}
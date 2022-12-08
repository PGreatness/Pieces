import React from 'react';
import '../css/editor.css'
import '../css/tileseteditor.css'
import { Box, Stack } from '@mui/system';
import MapToolBar from './MapToolBar';
import MapCanvas from './MapCanvas';
import MapRightBar from './MapRightBar';

export default function MapEditor(props) {
    

    return (
        <Box bgcolor={"#1f293a"} sx={{position: "fixed", height: '100vh', width: '100vw'}}>
            <Stack direction="row" justifyContent='space-between'>
                <MapToolBar/>
                <MapCanvas/>
                <MapRightBar setLoc={props.setLoc}/>
            </Stack>
        </Box>
    );
}
import React from 'react';
import '../css/editor.css'
import '../css/tileseteditor.css'
import { Box, Stack } from '@mui/system';
import TilesetToolBar from './TilesetToolBar';
import TilesetCanvas from './TilesetCanvas';
import TilesetRightBar from './TilesetRightBar';

export default function TileEditor() {
    return (
        <Box bgcolor={"#1f293a"}>
            <Stack direction="row" justifyContent='space-between'>
                <TilesetToolBar/>
                <TilesetCanvas/>
                <TilesetRightBar/>
            </Stack>
        </Box>
    )
}
import React from 'react';
import '../css/editor.css'
import '../css/tileseteditor.css'
import { Box, Stack } from '@mui/system';
import TilesetToolBar from './TilesetToolBar';
import TilesetCanvas from './TilesetCanvas';
import TilesetRightBar from './TilesetRightBar';
import {useEffect, useContext} from 'react'
import { GlobalStoreContext } from '../../../store/store'

export default function TileEditor(props) {

    const { store } = useContext(GlobalStoreContext)

    useEffect(() => {
        console.log("OPENING TILE EDITOR SCREEN (tl)")
        console.log(store.currentProject)
    },[])

    return (
        <Box bgcolor={"#1f293a"}>
            <Stack direction="row" justifyContent='space-between'>
                <TilesetToolBar/>
                <TilesetCanvas/>
                <TilesetRightBar setLoc={props.setLoc}/>
            </Stack>
        </Box>
    )
}
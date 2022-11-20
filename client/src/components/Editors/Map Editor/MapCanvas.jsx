import React from 'react'
import { Box, Stack } from '@mui/system';
import { Typography, Button, Tabs, Tab, Grid } from '@mui/material'
import { Undo, Redo } from '@mui/icons-material'
import { styled } from "@mui/material/styles";
import { useState, useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../../../store/store'

export default function MapCanvas() {

    // Map Editor Code Start

    const { store } = useContext(GlobalStoreContext)
    const [mapHeight, setMapHeight] = useState(store.currentProject.mapHeight)
    const [mapWidth, setMapWidth] = useState(store.currentProject.mapWidth)
    const [currentMapTiles, setCurrentMapTiles] = useState(store.currentProject.tiles)
    const [renderHeightRatio, setRenderHeightRatio] = useState(mapHeight/Math.max(mapHeight, mapWidth))
    const [renderWidthRatio, setRenderWidthRatio] = useState(mapWidth/Math.max(mapHeight, mapWidth))
    const [currentTile, setCurrentTile] = useState([0, 0])

    const handleClickTile = () => {
        console.log("Tile was clicked.")
    }

    const handleHoverTile = (e) => {
        let id = Number(e.currentTarget.id.slice(5))
        let x = Math.floor(id / mapWidth)
        let y = id % mapWidth
        setCurrentTile([x, y])
    }

    // Map Editor Code End


    const [ value, setValue ] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const StyledTab = styled(Tab)({
        "&.Mui-selected": {
            color: "#2dd4cf"
        }
    });

    return (
        <Box className='canvas_container' bgcolor={"#1f293a"} flex={10}>
            <Typography variant='h5' id='cursor_coord' color='azure'>{currentTile[0] + ", " + currentTile[1]}</Typography>
            <Button id='map_undo_button' sx={{minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px'}}>
                <Undo className='toolbar_mui_icon'/>
            </Button>
            <Button id='map_redo_button' sx={{minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px'}}>
                <Redo className='toolbar_mui_icon'/>
            </Button>

            <Grid container direction='row' rowSpacing={0} columns={mapWidth} bgcolor='#000000' style={{position: 'absolute', height: `${70*renderHeightRatio}vh`, width: `${70*renderWidthRatio}vh`, top: '50%', left: '50%', transform: 'translate(-50%, -60%)'}}>
                {currentMapTiles.length > 0
                    ? (currentMapTiles.map((tile, index) => (
                        tile
                            ? <Grid onMouseOver={handleHoverTile} onClick={handleClickTile} id={`tile_${index}`} className='tile' item xs={1} style={{borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.05)', borderWidth: '0.5px', height:`calc(100% / ${mapHeight}`}} bgcolor='#fff'></Grid>
                            : <Grid onMouseOver={handleHoverTile} onClick={handleClickTile} id={`tile_${index}`} className='tile' item xs={1} style={{height:`calc(100% / ${mapWidth}`}} bgcolor={'red'}></Grid>
                    )))
                    : Array(mapHeight * mapWidth).fill(null).map((tile, index) => (
                        <Grid onMouseOver={handleHoverTile} onClick={handleClickTile} id={`tile_${index}`} className='tile' item xs={1} style={{borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.05)', borderWidth: '0.5px', height:`calc(100% / ${mapHeight}`}} bgcolor='#fff'></Grid>
                    ))
                }
            </Grid>
        
            <Box bgcolor="#11182a" className="palettes_container">
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value} 
                        onChange={handleChange} 
                        centered
                        TabIndicatorProps={{style: {backgroundColor: "#2dd4cf"}}}
                        sx={{
                            '& .MuiTab-root': { color: "azure" },
                        }}>
                        <StyledTab label="Palette One"/>
                    </Tabs>
                </Box>
                <Box sx={{padding:2}}>
                    {value === 0 && (
                        <Stack direction='row' spacing={2}>
                            <img src={require("../images/dummyTile1.png")} className='palette_option' bgcolor='red'/>
                            <img src={require("../images/dummyTile2.png")} className='palette_option' bgcolor='blue'/>
                            <img src={require("../images/dummyTile3.png")} className='palette_option' bgcolor='green'/>
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
    )
}

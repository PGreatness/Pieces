import React from 'react'
import { Box, Stack } from '@mui/system';
import { Typography, Button, Tabs, Tab, Grid } from '@mui/material'
import { Undo, Redo } from '@mui/icons-material'
import { styled } from "@mui/material/styles";
import { useState, useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../../../store/store'
import MapTile from './MapTile';

export default function MapCanvas() {

    // Map Editor Code Start

    const { store } = useContext(GlobalStoreContext)
    const [mapHeight, setMapHeight] = useState(store.currentProject.mapHeight)
    const [mapWidth, setMapWidth] = useState(store.currentProject.mapWidth)
    const [currentMapTiles, setCurrentMapTiles] = useState(
        store.currentProject.tiles.length > 0 
            ? store.currentProject.tiles
            : Array(mapHeight * mapWidth).fill('')
    )
    const [renderHeightRatio, setRenderHeightRatio] = useState(mapHeight/Math.max(mapHeight, mapWidth))
    const [renderWidthRatio, setRenderWidthRatio] = useState(mapWidth/Math.max(mapHeight, mapWidth))
    const [currentTile, setCurrentTile] = useState([0, 0])
    const [tilesets, setTilesets] = useState(store.currentProject.tilesets)

    useEffect(() => {
        store.setCurrentMapTiles(currentMapTiles)
    }, [])

    useEffect(() => {
        console.log("Changing to store tilesets")
        console.log(store.currentProject.tilesets)
        setTilesets(store.currentProject.tilesets)
    }, [store.currentProject.tilesets])
    
    const fillHelper = async (x, y, originalTile) => {

        let map = store.currentMapTiles
        if (x < 0 || x >= mapHeight || y < 0 || y >= mapWidth || map[x * mapWidth + y] !== originalTile) {
            return
        }
        if (map[x * mapWidth + y] === originalTile) {
            map[x * mapWidth + y] = store.primaryTile
            fillHelper(x - 1, y, originalTile)
            fillHelper(x + 1, y, originalTile)
            fillHelper(x, y + 1, originalTile)
            fillHelper(x, y - 1, originalTile)
            // setCurrentMapTiles(map)
            await store.setCurrentMapTiles(map)
        }
        // let newMap = currentMapTiles.map(function(tile) {
        //     if (tile === originalTile) {
        //         return store.primaryTile
        //     }
        //     else {
        //         return tile
        //     }
        // })
        // setCurrentMapTiles(newMap)
    }

    const updateCurrentMapTiles = async (value, index) => {
        let map = store.currentMapTiles
        map[index] = value
        // setCurrentMapTiles(map)
        await store.setCurrentMapTiles(map)
    }

    const handleBucket = () => {
        // console.log(store.currentMapTiles)
        let originalTile = store.currentMapTiles[currentTile[0] * mapWidth + currentTile[1]]
        fillHelper(currentTile[0], currentTile[1], originalTile)
        // console.log(store.currentMapTiles)
    }

    const handleClickTileOption = (e) => {
        let src = e.currentTarget.src
        store.setPrimaryTile(src)
        setMapHeight(mapHeight)
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
                {store.currentMapTiles.length > 0 && store.currentMapTiles.map((tile, index) => (
                    <MapTile 
                        handleBucket={handleBucket}
                        updateCurrentMapTiles={updateCurrentMapTiles}
                        mapHeight={mapHeight} 
                        mapWidth={mapWidth}
                        index={index} 
                        handleHoverTile={handleHoverTile} 
                        // imgSrc={currentMapTiles[index]}/>
                        />
                ))}
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
                        {
                            tilesets.map((tileset, index) => (
                                <StyledTab label={tileset.name}/>
                            ))
                        }
                    </Tabs>
                </Box>
                <Box sx={{padding:2}}>
                <Stack direction='row' spacing={2}>
                    {
                        tilesets[value].tiles && tilesets[value].tiles.map((tile, index) => (
                            <img onClick={handleClickTileOption} src={require('../images/dummyTile1.png')} className='palette_option'/>
                        ))
                    }
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

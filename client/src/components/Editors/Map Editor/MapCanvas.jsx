import React from 'react'
import { Box, Stack } from '@mui/system';
import { Typography, Button, Tabs, Tab, Grid } from '@mui/material'
import { Undo, Redo, Delete } from '@mui/icons-material'
import { styled } from "@mui/material/styles";
import { useState, useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../../../store/store'
import MapTile from './MapTile';

export default function MapCanvas() {

    // Map Editor Code Start

    const { store } = useContext(GlobalStoreContext)

    const [mapHeight, setMapHeight] = useState(store.currentProject.mapHeight)
    const [mapWidth, setMapWidth] = useState(store.currentProject.mapWidth)
    const [currentMapTiles, setCurrentMapTiles] = useState(store.currentMapTiles)
    const [tilesets, setTilesets] = useState(store.mapTilesets)
    const [tileImages, setTileImages] = useState(store.mapTiles.map(function (tile) { return tile.tileImage }))
    console.log(tileImages)


    const [value, setValue] = useState(0);
    const [currentIndices, setCurrentIndices] = useState([0, store.mapTilesets[0].tiles.length])
    const [renderHeightRatio, setRenderHeightRatio] = useState(mapHeight / Math.max(mapHeight, mapWidth))
    const [renderWidthRatio, setRenderWidthRatio] = useState(mapWidth / Math.max(mapHeight, mapWidth))
    const [currentTile, setCurrentTile] = useState([0, 0])


    useEffect(() => {
        setMapHeight(store.currentProject.mapHeight)
        setMapWidth(store.currentProject.mapWidth)
        // TODO: probably update currentMapTiles as well
        // setCurrentMapTiles(store.currentMapTiles)
    }, [store.currentProject])

    // Updating map object in canvas
    useEffect(() => {
        //console.log(store.currentMapTiles)
        setCurrentMapTiles(store.currentMapTiles)
    }, [store.currentMapTiles])

    // updating map tilesets
    useEffect(() => {
        setTilesets(store.mapTilesets)
        setTileImages(store.mapTiles.map(function (tile) { return tile.tileImage }))
        console.log(store.mapTiles.map(function (tile) { return tile.tileImage }))
    }, [store.mapTilesets])



    // useEffect(() => {
    //     console.log("Changing to store tilesets")
    //     console.log(store.currentProject.tilesets)

    //     TODO: THESE ARE JUST TILESETIDS, GET ACTUAL TILESET OBJECT !!!!!!
    //     setTilesets(store.currentProject.tilesets)

    // }, [store.currentProject.tilesets])

    // useEffect(() => {
    //     store.getMapTilesets(store.currentProject._id).then((tilesetObjs) => {
    //         setTilesets(tilesetObjs)
    //         console.log(tilesetObjs)
    //         console.log(tilesets)

    //         let tileIds = []
    //         let tileImages = []

    //         // Build array of all tile ids
    //         for (let i = 0; i < tilesetObjs.length; i++) {
    //             tileIds = tileIds.concat(tilesetObjs[i].tiles)
    //         }
    //         console.log(tileIds)

    //         const fetchTiles = async () => {
    //             await Promise.all(tileIds.map(async (tileId) => {
    //                 let tile = await store.getTileById(tileId)
    //                 tileImages.push(tile.tileImage)
    //             }));
    //         }

    //         fetchTiles()

    //         console.log(tileImages)
    //         setTileImages(tileImages)
    //     })
    // }, [store.currentProject])



    const fillHelper = async (x, y, originalTile) => {

        let map = currentMapTiles
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
        let map = currentMapTiles
        map[index] = value
        // setCurrentMapTiles(map)
        await store.setCurrentMapTiles(map)
    }

    const handleBucket = () => {
        let originalTile = currentMapTiles[currentTile[0] * mapWidth + currentTile[1]]
        fillHelper(currentTile[0], currentTile[1], originalTile)
    }

    const handleClickTileOption = (e) => {
        let id = Number(e.currentTarget.id.replace("tile_option_", ""))
        store.setPrimaryTile(id)
        setMapHeight(mapHeight)
    }

    const handleHoverTile = (e) => {
        let id = Number(e.currentTarget.id.slice(5))
        let x = Math.floor(id / mapWidth)
        let y = id % mapWidth
        setCurrentTile([x, y])
    }

    // Map Editor Code End


    const handleChange = (event, newValue) => {
        console.log("value changed...")
        // get next tileset!
        setValue(newValue);
        let startIndex = 0
        for (let i = 0; i < newValue; i++) {
            startIndex += tilesets[i].tiles.length
        }
        let endIndex = startIndex + tilesets[newValue].tiles.length
        setCurrentIndices([startIndex, endIndex])
    }

    const deleteTileset = () => {
        store.deleteTilesetFromMap(tilesets[value]._id)
        setValue(0);
    }

    const StyledTab = styled(Tab)({
        "&.Mui-selected": {
            color: "#2dd4cf"
        }
    });

    return (
        <Box className='canvas_container' bgcolor={"#1f293a"} flex={10}>
            <Typography variant='h5' id='cursor_coord' color='azure'>{currentTile[0] + ", " + currentTile[1]}</Typography>
            <Button id='map_undo_button' sx={{ minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px' }}>
                <Undo className='toolbar_mui_icon' />
            </Button>
            <Button id='map_redo_button' sx={{ minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px' }}>
                <Redo className='toolbar_mui_icon' />
            </Button>

            <Grid container direction='row' rowSpacing={0} columns={mapWidth} bgcolor='#000000' style={{ position: 'absolute', height: `${70 * renderHeightRatio}vh`, width: `${70 * renderWidthRatio}vh`, top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }}>
                {currentMapTiles?.length > 0 && currentMapTiles.map((tile, index) => (
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
                {tilesets.length > 0 ?
                    <Grid container >
                        <Grid item xs={11}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    centered
                                    TabIndicatorProps={{ style: { backgroundColor: "#2dd4cf" } }}
                                    sx={{
                                        '& .MuiTab-root': { color: "azure" },
                                    }}>
                                    {
                                        tilesets.map((tileset, index) => (
                                            <StyledTab label={tileset.title} />
                                        ))
                                    }
                                </Tabs>
                            </Box>
                        </Grid>
                        <Grid item xs={1}>
                            {tilesets.length > 0 ?
                                <Button onClick={deleteTileset} className='tileset_option_delete'>
                                    <Delete style={{ color: 'azure', fontSize: '25px' }} />
                                </Button> : <></>}
                        </Grid>
                    </Grid>
                    : <Box sx={{ textAlign: 'center', marginTop: '40px' }}>
                        <Typography sx={{ fontSize: '25px' }} color='azure'>
                            Import Tilesets to start working!
                    </Typography>
                    </Box>
                }
                <Box sx={{ padding: 2 }}>
                    <Stack direction='row' spacing={2}>
                        {console.log("store map tiles")}
                        {console.log(store.mapTiles)}
                        {
                            // tileImages.slice(currentIndices[0], currentIndices[1]).map((image, index) => (
                            //     <img onClick={handleClickTileOption} src={image} className='palette_option' />
                            // ))
                            store.mapTiles.map((image, index) => (
                                (index >= currentIndices[0] && index < currentIndices[1])
                                    ? <img onClick={handleClickTileOption} src={store.mapTiles[index].tileImage} id={`tile_option_${index}`} className='palette_option' />
                                    : null
                            ))
                        }
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

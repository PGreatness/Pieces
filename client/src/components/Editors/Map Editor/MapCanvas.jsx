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
    const [tileImages, setTileImages] = useState([])
    const [renderHeightRatio, setRenderHeightRatio] = useState(mapHeight / Math.max(mapHeight, mapWidth))
    const [renderWidthRatio, setRenderWidthRatio] = useState(mapWidth / Math.max(mapHeight, mapWidth))
    const [currentTile, setCurrentTile] = useState([0, 0])
    const [tilesets, setTilesets] = useState([])
    const [value, setValue] = useState(0);
    const [currentIndices, setCurrentIndices] = useState([0,0])


    useEffect(() => {
        store.setCurrentMapTiles(currentMapTiles)
    }, [])

    useEffect(() => {
        store.getMapTilesets(store.currentProject._id).then((tilesetObjs) => {
            setTilesets(tilesetObjs)
            console.log(tilesetObjs)

            let tileIds = []
            let tiles = []
            let tileImages = []
    
            const fetchTile  = async(id) => {
                let tile = await store.getTileById(id)
                let td = tile.tileData
                tiles.push(td)
    
                let rgba = []
    
                td.forEach((t) => {
                    if (t.length === 0) {
                        rgba.push(0)
                        rgba.push(0)
                        rgba.push(0)
                        rgba.push(0)
                    } 
                    else {
                        var bigint = parseInt(t.slice(1), 16);
                        var r = (bigint >> 16) & 255;
                        var g = (bigint >> 8) & 255;
                        var b = bigint & 255;
                        rgba.push(r)
                        rgba.push(g)
                        rgba.push(b)
                        rgba.push(255)
                    }
                })
    
                let rgbaArray = new ImageData(new Uint8ClampedArray(rgba), tile.width, tile.height);
    
                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');
                canvas.height = tile.height
                canvas.width = tile.width
    
                context.putImageData(rgbaArray, 0, 0);
                let dataUrl = canvas.toDataURL()
                tileImages.push(dataUrl)
                setTileImages(tileImages)
                canvas.remove()
            }
    
            //Build array of all tile ids
            for (let i = 0; i < tilesets.length; i++) {
                tileIds = tileIds.concat(tilesets[i].tiles)
            }
    
            //Get tile data from tile
            for (let i = 0; i < tileIds.length; i++) {
                fetchTile(tileIds[i])
            }
        })
    }, [])

    // useEffect(() => {
        
    //     let tileIds = []
    //     let tiles = []
    //     let tileImages = []

    //     const fetchTile  = async(id) => {
    //         let tile = await store.getTileById(id)
    //         let td = tile.tileData
    //         tiles.push(td)

    //         let rgba = []

    //         td.forEach((t) => {
    //             if (t.length === 0) {
    //                 rgba.push(0)
    //                 rgba.push(0)
    //                 rgba.push(0)
    //                 rgba.push(0)
    //             } 
    //             else {
    //                 var bigint = parseInt(t.slice(1), 16);
    //                 var r = (bigint >> 16) & 255;
    //                 var g = (bigint >> 8) & 255;
    //                 var b = bigint & 255;
    //                 rgba.push(r)
    //                 rgba.push(g)
    //                 rgba.push(b)
    //                 rgba.push(255)
    //             }
    //         })

    //         let rgbaArray = new ImageData(new Uint8ClampedArray(rgba), tile.width, tile.height);

    //         let canvas = document.createElement('canvas');
    //         let context = canvas.getContext('2d');
    //         canvas.height = tile.height
    //         canvas.width = tile.width

    //         context.putImageData(rgbaArray, 0, 0);
    //         let dataUrl = canvas.toDataURL()
    //         tileImages.push(dataUrl)
    //         setTileImages(tileImages)
    //         canvas.remove()
    //     }

    //     //Build array of all tile ids
    //     for (let i = 0; i < tilesets.length; i++) {
    //         tileIds = tileIds.concat(tilesets[i].tiles)
    //     }

    //     //Get tile data from tile
    //     for (let i = 0; i < tileIds.length; i++) {
    //         fetchTile(tileIds[i])
    //     }

    // }, [])

    useEffect(() => {
        console.log("Changing to store tilesets")
        console.log(store.currentProject.tilesets)

        // TODO: THESE ARE JUST TILESETIDS, GET ACTUAL TILESET OBJECT !!!!!!
        // setTilesets(store.currentProject.tilesets)

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


    const handleChange = (event, newValue) => {
        console.log("value changed...")
        // get next tileset!
        setValue(newValue);
        let startIndex = 0
        for (let i = 0; i < newValue; i++) {
            startIndex += tilesets[i].tiles.length
        }
        let endIndex = startIndex + tilesets[newValue].tiles.length
        console.log("(" + startIndex + " , " + endIndex + ")")
        setCurrentIndices([startIndex, endIndex])

        console.log(tileImages)
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
                <Box sx={{ padding: 2 }}>
                    <Stack direction='row' spacing={2}>
                        {
                            // tilesets[value] && tilesets[value].tiles && tilesets[value].tiles.map((tile, index) => (
                            //     <img onClick={handleClickTileOption} src={tileImages[1] ? tileImages[1] : require('../images/dummyTile1.png')} className='palette_option' />
                            // ))
                    
                            tileImages.map((image, index) => (
                                // {console.log(image + " " + index)}
                                <img src={tileImages[1]} className='palette_option' />
                                // <img onClick={handleClickTileOption} src={require('../images/dummyTile1.png')} className='palette_option' />
                            ))
                        }
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

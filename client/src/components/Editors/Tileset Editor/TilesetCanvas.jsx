import React from 'react'
import { Box, Stack } from '@mui/system';
import { Typography, Button, Tabs, Tab,Grid } from '@mui/material'
import { Undo, Redo,Add, Translate } from '@mui/icons-material'
import { styled } from "@mui/material/styles";
import { useState, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../../../store/store'


export default function TilesetCanvas() {

    // Tileset Editor Code Begin

    const { store } = useContext(GlobalStoreContext)
    const [ currentTile, setCurrentTile ] = useState(store.currentTile)
    const [ height, setHeight ] = useState(5)
    const [ width, setWidth ] = useState(5)
    const [ currentPixel, setCurrentPixel ] = useState([0, 0])
    const [ movePixels, setMovePixels ] = useState([])

    useEffect(() => {
        store.loadTileset('6369f842a69ccddf5fbcb78e')
    }, [])

    useEffect(() => {
        setCurrentTile(store.currentTile)
    }, [store.currentTile])

    // Auto Update code (not working rn)
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (store.currentTile) {
    //             store.updateTile(store.currentTile._id, currentTile.tilesetId, currentTile.tileData)
    //             console.log("Auto updated")
    //         }
    //     }, 5000);
      
    //     return () => clearInterval(interval);
    //   }, []); 

    const handleAddTile = async () => {
        await store.addTileToCurrentTileset()
    }

    const handleSelectTile = async (tileId) => {
        await store.updateTile(store.currentTile._id, currentTile.tilesetId, currentTile.tileData)
        await store.setCurrentTile(tileId)
        setCurrentTile(store.currentTile)
    }

    const handleHoverPixel = (e) => {
        let id = Number(e.currentTarget.id.replace("pixel_", ""))
        let x = Math.floor(id / width)
        let y = id % width
        setCurrentPixel([x, y])
    }

    const fillHelper = (x, y, originalColor) => {
        let tile = currentTile
        if (x < 0 || x >= height || y < 0 || y >= width) {
            return
        }
        if (tile.tileData[x * width + y] === originalColor) {
            tile.tileData[x * width + y] = store.primaryColor
            fillHelper(x - 1, y, originalColor)
            fillHelper(x + 1, y, originalColor)
            fillHelper(x, y + 1, originalColor)
            fillHelper(x, y - 1, originalColor)
            setCurrentTile(tile)
        }
    }

    const handleClickPixel = (e) => {

        let tile = currentTile
        switch (store.tilesetTool) {
            case 'brush':
                tile.tileData[currentPixel[0] * width + currentPixel[1]] = store.primaryColor
                setCurrentTile(tile)
                break

            case 'eraser':
                tile.tileData[currentPixel[0] * width + currentPixel[1]] = ''
                setCurrentTile(tile)
                break

            case 'dropper':
                store.setPrimaryColor(tile.tileData[currentPixel[0] * width + currentPixel[1]])
                break

            case 'bucket':
                let originalColor = currentTile.tileData[currentPixel[0] * width + currentPixel[1]]
                fillHelper(currentPixel[0], currentPixel[1], originalColor)
                break

        }
    }
    
    // Tileset Editor Code End

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
            <Typography variant='h5' id='cursor_coord' color='azure'>{currentPixel[0] + ", " + currentPixel[1]}</Typography>
            <Button id='tile_undo_button' sx={{minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px'}}>
                <Undo className='toolbar_mui_icon'/>
            </Button>
            <Button id='tile_redo_button' sx={{minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px'}}>
                <Redo className='toolbar_mui_icon'/>
            </Button>

            <Grid container direction='row' rowSpacing={0} columns={width} bgcolor='#000000' style={{position: 'absolute', height: '65vh', width: '65vh', top: '50%', left: '50%', transform: 'translate(-50%, -60%)'}}>
                {currentTile && currentTile.tileData.map((pixel, index) => (
                    pixel === ''
                        ? <Grid onMouseOver={handleHoverPixel} onClick={handleClickPixel} id={`pixel_${index}`} className='pixel' item xs={1} style={{borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.05)', borderWidth: '0.5px', height:`calc(100% / ${width}`}} bgcolor='#fff'></Grid>
                        : <Grid onMouseOver={handleHoverPixel} onClick={handleClickPixel} id={`pixel_${index}`} className='pixel' item xs={1} style={{height:`calc(100% / ${width}`}} bgcolor={pixel}></Grid>
                ))}
            </Grid>

            <Box bgcolor="#11182a" className="tileset_container">
                <Box bgcolor="#11182a" style={{borderRadius:'15px 15px 0px 0px', height:'30px', width:'15%', position:'absolute', bottom:'100%'}}>
                    <Typography style={{color:'azure'}}>Tileset</Typography>
                </Box>
                <Box sx={{padding:2}}>
                    {value === 0 && (
                        <Stack direction='row' spacing={2}>
                            {store.currentTileset && store.currentTileset.tiles.map((tileId) => (
                                <Button onClick={() => handleSelectTile(tileId)}>
                                    <img src={require('../images/dummyTilePreview.png')} className='tile_option'/>
                                </Button>
                            ))}
                            <Button>
                                <Add onClick={handleAddTile} style={{minHeight: '80px', maxHeight:'80px', minWidth:'80px', maxWidth:'80px'}}/>
                            </Button>
                            
                        </Stack>
                    )}
                </Box>
            </Box>
            {/* <img style={{marginTop:'50px', height:'450px', width:'450px'}} src={require('../images/dummyTilePreview.png')} className='tile_canvas'/> */}
        </Box>
    )
}

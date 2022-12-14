import React from 'react'
import { Box, Stack } from '@mui/system';
import { Modal, Slider, TextField, Tab, Tabs, Typography, TabIndicatorProps, List, ListItem, Grid, Button } from '@mui/material'
import { Brush, HighlightAlt, OpenWith, FormatColorFill, Colorize, Edit, IosShare, Clear, AddBox, LibraryAdd, SwapHoriz, ContentCopy, Delete, ArrowUpward, Check, ArrowDownward,Add, Visibility} from '@mui/icons-material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'
import { SketchPicker } from 'react-color'
import { useState, useContext } from 'react'
import { GlobalStoreContext } from '../../../store/store'
import AuthContext from '../../../auth/auth';


export default function TilesetToolBar() {

     // Code for Tileset Editing

    // const [ currTool, setCurrTool ] = useState(null)
    // const [ currColor, setCurrColor ] = useState(null)
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [ currColor, setCurrColor ] = useState('#ffffff')
    const [ currTool, setCurrTool ] = useState('brush')
    const [ colorHistory, setColorHistory ] = useState(['#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff'])


    const handleSelectColor = (color, event) => {
        setColorHistory(colorHistory.pop())
        setColorHistory([store.primaryColor, ...colorHistory])
        store.setPrimaryColor(color.hex)
    }

    const handleSelectPastColor = (event) => {
        let history_index = Number(event.currentTarget.id.replace("past_color_", ""))
        let selectColor = colorHistory[history_index]
        let hist = colorHistory
        hist.splice(history_index, 1)
        setColorHistory([store.primaryColor, ...hist])
        store.setPrimaryColor(selectColor)
    }

    const handleSwapColors = () => {
        store.swapColors()
    }

    const changeCurrColor = (color, event) => {
        setCurrColor(color.hex)
    }

    const handleToolClick = (event) => {
        let tool = event.currentTarget.id

        setCurrTool(tool)
        store.setTilesetTool(tool)
    }


    // End 

    const [ openClearConfirm, setOpenClearConfirm ] = useState(false);

    const handleOpenClearConfirm = () => {
        setOpenClearConfirm(true)
      }
    
    const handleCloseClearConfirm = () => {
        setOpenClearConfirm(false)
    }

    const convertToImage = (tile) => {
        let rgba = []
        let height = store.currentTile.height
        let width = store.currentTile.height
  
        tile.tileData.forEach((tile) => {
            if (tile.length === 0) {
                rgba.push(0)
                rgba.push(0)
                rgba.push(0)
                rgba.push(0)
            } else {
                var bigint = parseInt(tile.slice(1), 16);
                var r = (bigint >> 16) & 255;
                var g = (bigint >> 8) & 255;
                var b = bigint & 255;
                rgba.push(r)
                rgba.push(g)
                rgba.push(b)
                rgba.push(255)
  
            }
        })
  
        console.log(rgba.length)
  
        var rgbaArray = new ImageData(new Uint8ClampedArray(rgba), width, height);
  
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.height = height
        canvas.width = width
  
        context.putImageData(rgbaArray, 0, 0);
        var imgSrc = canvas.toDataURL();
        canvas.remove();
        return imgSrc
    } 

    const handleConfirmClear = async () => {
        setOpenClearConfirm(false)
        let tile = store.currentTile
        let oldData = [...tile.tileData]
        tile.tileData = Array(store.currentTile.tileData.length).fill('')
        store.setCurrentTile(tile)
        let imgSrc = convertToImage(tile);
        await store.updateTile(store.currentTile._id, store.currentTile.tilesetId, store.currentTile.tileData, imgSrc)
        auth.socket.emit('updateTileset', { project: store.currentProject._id, tileset: store.currentProject })
        await store.addTransaction(oldData, store.currentTile.tileData)
    }

    return (
        <Box bgcolor={"#11182a"} flex={2} className='map_toolbar'>

            <Grid container space={1} justify='center'>

                <Grid item xs={12} className="toolbar_header" style={{marginTop: '10px', marginBottom: '10px'}}>
                    <Typography variant="h5" className="editor_typography">Tools</Typography>
                </Grid>

                <Grid item xs={1} className="toolbar_grid_item"></Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button onClick={handleToolClick} id="brush" style={{minHeight: '40px', maxHeight: '40px', minWidth: '50px', maxWidth: '50px'}} variant={currTool=='brush' ? "contained" : ""}>
                        <Brush className="toolbar_mui_icon"/> 
                    </Button>
                </Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button onClick={handleToolClick} style={{minHeight: '40px', maxHeight: '40px', minWidth: '50px', maxWidth: '50px'}} id="eraser" variant={currTool=='eraser' ? "contained" : ""}>
                        <FontAwesomeIcon icon={faEraser} className="toolbar_fa_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={1} className="toolbar_grid_item"></Grid>

                {/* <Grid item xs={1} className="toolbar_grid_item"></Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button onClick={handleToolClick} style={{minHeight: '40px', maxHeight: '40px', minWidth: '50px', maxWidth: '50px'}} id="select" variant={currTool=='select' ? "contained" : ""}>
                        <HighlightAlt className="toolbar_mui_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button onClick={handleToolClick} style={{minHeight: '40px', maxHeight: '40px', minWidth: '50px', maxWidth: '50px'}} id="move" variant={currTool=='move' ? "contained" : ""}>
                        <OpenWith className="toolbar_mui_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={1} className="toolbar_grid_item"></Grid> */}

                <Grid item xs={1} className="toolbar_grid_item"></Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button onClick={handleToolClick} style={{minHeight: '40px', maxHeight: '40px', minWidth: '50px', maxWidth: '50px'}} id="bucket" variant={currTool=='bucket' ? "contained" : ""}>
                        <FormatColorFill className="toolbar_mui_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button onClick={handleToolClick} style={{minHeight: '40px', maxHeight: '40px', minWidth: '50px', maxWidth: '50px'}} id="dropper" variant={currTool=='dropper' ? "contained" : ""}>
                        <Colorize className="toolbar_mui_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={1} className="toolbar_grid_item"></Grid>

                <Grid item xs={1} className="toolbar_grid_item"></Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button id="clear" style={{minHeight: '40px', maxHeight: '40px', minWidth: '50px', maxWidth: '50px'}} onClick={handleOpenClearConfirm}>
                        <Clear className="toolbar_mui_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                </Grid>
                <Grid item xs={1} className="toolbar_grid_item"></Grid>

                <Grid item xs={12} align='center'>
                    <Box style={{marginTop: '20px'}} className="brush_selections_container_tileset">
                        <Box bgcolor={store.primaryColor} className="brush_selection_tileset" id="color_primary"></Box>
                        <Box bgcolor={store.secondaryColor} className="brush_selection_tileset" id="color_secondary"></Box>
                        <Button className="toolbar_mui_icon" id="swap_primary_color">
                            <SwapHoriz onClick={handleSwapColors}/>
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} align='center' style={{marginTop:'10px'}}>
                    <SketchPicker 
                        disableAlpha 
                        presetColors={[]} 
                        width={125} 
                        onChangeComplete={handleSelectColor}
                        color={store.primaryColor}
                    />
                </Grid>

                <Grid item xs={12} style={{marginTop:'20px', marginLeft: '10px'}}>
                    <Typography style={{color:'azure'}}>Recent Colors:</Typography>
                </Grid>
                <Grid item xs={12} style={{marginTop:'5px'}}>
                    <Grid container justify='center'>
                        <Grid item xs={3} align='center'>
                            <Button id="past_color_0" onClick={handleSelectPastColor} style={{backgroundColor: colorHistory[0], minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                        <Grid item xs={3} align='center'>
                            <Button id="past_color_1" onClick={handleSelectPastColor} style={{backgroundColor: colorHistory[1], minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                        <Grid item xs={3} align='center'>
                            <Button id="past_color_2" onClick={handleSelectPastColor} style={{backgroundColor: colorHistory[2], minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                        <Grid item xs={3} align='center'>
                            <Button id="past_color_3" onClick={handleSelectPastColor} style={{backgroundColor: colorHistory[3], minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{marginTop:'15px'}}>
                    <Grid container justify='center'>
                        <Grid item xs={3} align='center'>
                            <Button id="past_color_4" onClick={handleSelectPastColor} style={{backgroundColor: colorHistory[4], minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                        <Grid item xs={3} align='center'>
                            <Button id="past_color_5" onClick={handleSelectPastColor} style={{backgroundColor: colorHistory[5], minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                        <Grid item xs={3} align='center'>
                            <Button id="past_color_6" onClick={handleSelectPastColor} style={{backgroundColor: colorHistory[6], minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                        <Grid item xs={3} align='center'>
                            <Button id="past_color_7" onClick={handleSelectPastColor} style={{backgroundColor: colorHistory[7], minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                    </Grid>
                </Grid> 
            </Grid>


            <Modal
                open={openClearConfirm}
                onClose={handleCloseClearConfirm}
            >
                <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
                <Stack direction='column'>
                    <Typography variant='h5' color='azure'>Proceed to Clear?</Typography>
                    <Stack direction='row'>
                    <Button onClick={handleConfirmClear}>
                        <Typography>Confirm</Typography>
                        <Check/>
                    </Button>
                    <Button onClick={handleCloseClearConfirm}>
                        <Typography>Cancel</Typography>
                        <Clear/>
                    </Button>
                    </Stack>
                </Stack>
                </Box>
            </Modal>

        </Box>
    )
}

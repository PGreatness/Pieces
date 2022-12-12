import React from 'react'
import { Box, Stack } from '@mui/system';
import { List, Modal, ListItem, ListItemIcon, ListItemButton, ListItemText, Typography, Grid, Button} from '@mui/material'
import { Brush, Check, HighlightAlt, OpenWith, FormatColorFill, Colorize, Clear, SwapHoriz } from '@mui/icons-material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, useContext } from 'react'
import { GlobalStoreContext } from "../../../store/store"
import AuthContext from '../../../auth/auth'

export default function MapToolBar() {

    const { store } = useContext(GlobalStoreContext)
    const { auth } = useContext(AuthContext)
    const [ openClearConfirm, setOpenClearConfirm ] = useState(false);
    const [ currTool, setCurrTool ] = useState('brush')

    useEffect(() => {
        setCurrTool(currTool)
    }, [store.primaryTile, store.secondaryTile])

    const handleOpenClearConfirm = () => {
        setOpenClearConfirm(true)
      }
    
    const handleCloseClearConfirm = () => {
        setOpenClearConfirm(false)
    }

    const handleSwapTiles = async () => {
        await store.swapTiles()
    }

    const handleToolClick = (event) => {
        let tool = event.currentTarget.id
        setCurrTool(tool)
        store.setTilesetTool(tool)
    }

    const checkArrayEqual = (arr1, arr2) => {
        return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
    }

    const handleConfirmClear = async () => {
        setOpenClearConfirm(false)
        // let map = store.currentProject
        // map.tiles = Array(store.currentProject.mapHeight * store.currentProject.mapWidth).fill(null)
        // store.setCurrentProject(map._id)
        let oldData = [...store.currentMapTiles]
        // if (checkArrayEqual(oldData, Array(store.currentProject.mapHeight * store.currentProject.mapWidth).fill(-1))) {
		// 	console.log("no change")
		// 	return
		// }
        await store.setCurrentMapTiles(Array(store.currentProject.mapHeight * store.currentProject.mapWidth).fill(-1))
        // await store.addTransaction(oldData, Array(store.currentProject.mapHeight * store.currentProject.mapWidth).fill(-1))
        auth.socket.emit('forceViewportRerender')
        auth.socket.emit('updateMap', { project: store.currentProject._id })
    }

    return (
        <Box bgcolor={"#11182a"} flex={2} className='map_toolbar'>

            <Grid container space={1} justify='center'>

                <Grid item xs={12} className="toolbar_header">
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

                <Grid item xs={1} className="toolbar_grid_item"></Grid>
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
                <Grid item xs={1} className="toolbar_grid_item"></Grid>

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

                <Grid item xs={12}>
                    <Box style={{marginTop: '10px'}} className="brush_selections_container">
                        {store.primaryTile !== -1
                            ? <img src={store.mapTiles[store.primaryTile].tileImage} className="brush_tile_selection" id="tile_primary"/>
                            : <Box style={{height:'80px', width:'80px'}} className="brush_selection" bgcolor='white' id="tile_primary"></Box>
                        }
                        {store.secondaryTile !== -1
                            ? <img src={store.mapTiles[store.secondaryTile].tileImage} className="brush_tile_selection_tileset" id="tile_secondary"/>
                            : <Box className="brush_selection_tileset" bgcolor='white' id="tile_secondary"></Box>
                        }
                        <Button onClick={handleSwapTiles} className="toolbar_mui_icon" id="swap_primary">
                            <SwapHoriz/>
                        </Button>
                    </Box>
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
                        <Typography >Confirm</Typography>
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

import React from 'react'
import { Box, Stack } from '@mui/system';
import { List, Modal, ListItem, ListItemIcon, ListItemButton, ListItemText, Typography, Grid, Button} from '@mui/material'
import { Brush, Check, HighlightAlt, OpenWith, FormatColorFill, Colorize, Clear, SwapHoriz } from '@mui/icons-material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

export default function MapToolBar() {

    const [ openClearConfirm, setOpenClearConfirm ] = useState(false);

    const handleOpenClearConfirm = () => {
        setOpenClearConfirm(true)
      }
    
      const handleCloseClearConfirm = () => {
        setOpenClearConfirm(false)
      }

    return (
        <Box bgcolor={"#11182a"} flex={2} className='map_toolbar'>

            <Grid container space={1}>

                <Grid item xs={12} className="toolbar_header">
                    <Typography variant="h5" className="editor_typography">Tools</Typography>
                </Grid>

                <Grid item xs={1} className="toolbar_grid_item"></Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button>
                        <Brush className="toolbar_mui_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button>
                        <FontAwesomeIcon icon={faEraser} className="toolbar_fa_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={1} className="toolbar_grid_item"></Grid>

                <Grid item xs={1} className="toolbar_grid_item"></Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button>
                        <HighlightAlt className="toolbar_mui_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button>
                        <OpenWith className="toolbar_mui_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={1} className="toolbar_grid_item"></Grid>

                <Grid item xs={1} className="toolbar_grid_item"></Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button>
                        <FormatColorFill className="toolbar_mui_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button>
                        <Colorize className="toolbar_mui_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={1} className="toolbar_grid_item"></Grid>

                <Grid item xs={1} className="toolbar_grid_item"></Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                    <Button onClick={handleOpenClearConfirm}>
                        <Clear className="toolbar_mui_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                </Grid>
                <Grid item xs={1} className="toolbar_grid_item"></Grid>

                <Grid item xs={12}>
                    <Box className="brush_selections_container">
                        <img src={require("../images/dummyTile1.png")} className="brush_selection" id="tile_primary"/>
                        <img src={require("../images/dummyTile2.png")} className="brush_selection" id="tile_secondary"/>
                        <Button className="toolbar_mui_icon" id="swap_primary">
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
                    <Button onClick={handleCloseClearConfirm}>
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

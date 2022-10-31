import React from 'react'
import { Box, Stack } from '@mui/system';
import { List, ListItem, ListItemIcon, ListItemButton, ListItemText, Typography, Grid, Button} from '@mui/material'
import { Brush, HighlightAlt, OpenWith, FormatColorFill, Colorize, Clear, SwapHoriz } from '@mui/icons-material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'

export default function MapToolBar() {
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
                    <Button>
                        <Clear className="toolbar_mui_icon"/>
                    </Button>
                </Grid>
                <Grid item xs={5} className="toolbar_grid_item">
                </Grid>
                <Grid item xs={1} className="toolbar_grid_item"></Grid>

                <Grid item xs={12}>
                    <Box className="brush_selections_container">
                        <Box bgcolor={"#00dd00"} className="brush_selection" id="tile_primary"></Box>
                        <Box bgcolor={"#0000dd"} className="brush_selection" id="tile_secondary"></Box>
                        <Button className="toolbar_mui_icon" id="swap_primary">
                            <SwapHoriz/>
                        </Button>
                    </Box>
                </Grid>

            </Grid>
        
        </Box>
    )
}

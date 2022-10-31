import React from 'react'
import { Box, Stack } from '@mui/system';
import { List, ListItem, ListItemIcon, ListItemButton, ListItemText, Typography, Grid, Button} from '@mui/material'
import { Brush, HighlightAlt, OpenWith, FormatColorFill, Colorize, Clear, SwapHoriz } from '@mui/icons-material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'
import { SketchPicker } from 'react-color'

export default function TilesetToolBar() {
    return (
        <Box bgcolor={"#11182a"} flex={2} className='map_toolbar'>

            <Grid container space={1} justify='center'>

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

                <Grid item xs={12} align='center'>
                    <Box style={{marginTop: '10px'}} className="brush_selections_container_tileset">
                        <Box bgcolor={"#00dd00"} className="brush_selection_tileset" id="color_primary"></Box>
                        <Box bgcolor={"#0000dd"} className="brush_selection_tileset" id="color_secondary"></Box>
                        <Button className="toolbar_mui_icon" id="swap_primary_color">
                            <SwapHoriz/>
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} align='center' style={{marginTop:'10px'}}>
                    <SketchPicker disableAlpha presetColors={[]} width={125}/>
                </Grid>

                <Grid item xs={12} style={{marginTop:'20px'}}>
                    <Typography style={{color:'azure'}}>Recent Colors:</Typography>
                </Grid>
                <Grid item xs={12} style={{marginTop:'5px'}}>
                    <Grid container justify='center'>
                        <Grid item xs={3} align='center'>
                            <Button style={{backgroundColor:'#339933', minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                        <Grid item xs={3} align='center'>
                            <Button style={{backgroundColor:'#33bb33', minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                        <Grid item xs={3} align='center'>
                            <Button style={{backgroundColor:'#44ee22', minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                        <Grid item xs={3} align='center'>
                            <Button style={{backgroundColor:'#80461B', minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{marginTop:'15px'}}>
                    <Grid container justify='center'>
                        <Grid item xs={3} align='center'>
                            <Button style={{backgroundColor:'#993237', minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                        <Grid item xs={3} align='center'>
                            <Button style={{backgroundColor:'#99cb38', minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                        <Grid item xs={3} align='center'>
                            <Button style={{backgroundColor:'#28a7ab', minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                        <Grid item xs={3} align='center'>
                            <Button style={{backgroundColor:'#20373B', minHeight:'30px', minWidth:'30px', maxHeight:'30px', maxWidth:'30px'}}></Button>
                        </Grid>
                    </Grid>
                </Grid> 
            </Grid>
        </Box>
    )
}

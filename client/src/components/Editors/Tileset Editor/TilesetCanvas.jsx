import React from 'react'
import { Box, Stack } from '@mui/system';
import { Typography, Button, Tabs, Tab } from '@mui/material'
import { Undo, Redo,Add } from '@mui/icons-material'
import { styled } from "@mui/material/styles";
import { useState } from 'react'

export default function TilesetCanvas() {

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
            <Typography variant='h5' id='cursor_coord' color='azure'>2, 3</Typography>
            <Button id='tile_undo_button' sx={{minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px'}}>
                <Undo className='toolbar_mui_icon'/>
            </Button>
            <Button id='tile_redo_button' sx={{minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px'}}>
                <Redo className='toolbar_mui_icon'/>
            </Button>

            <Box bgcolor="#11182a" className="tileset_container">
                <Box bgcolor="#11182a" style={{borderRadius:'15px 15px 0px 0px', height:'30px', width:'15%', position:'absolute', bottom:'100%'}}>
                    <Typography style={{color:'azure'}}>Tileset</Typography>
                </Box>
                <Box sx={{padding:2}}>
                    {value === 0 && (
                        <Stack direction='row' spacing={2}>
                            <Button>
                                <img src={require('../images/dummyTilePreview.png')} className='tile_option'/>
                            </Button>
                            <Button>    
                                <img src={require('../images/dummyTile2.png')} className='tile_option'/>
                            </Button>
                            <Button>
                                <img src={require('../images/dummyTile3.png')} className='tile_option'/>
                            </Button>
                            <Button>
                                <Add style={{minHeight: '80px', maxHeight:'80px', minWidth:'80px', maxWidth:'80px'}}/>
                            </Button>
                            
                        </Stack>
                    )}
                </Box>
            </Box>
            {/* <canvas id='tile_canvas'></canvas> */}
            <img style={{marginTop:'50px', height:'450px', width:'450px'}} src={require('../images/dummyTilePreview.png')} className='tile_canvas'/>
        </Box>
    )
}

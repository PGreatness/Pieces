import React from 'react'
import { Box, Stack } from '@mui/system';
import { Typography, Button, Tabs, Tab } from '@mui/material'
import { Undo, Redo } from '@mui/icons-material'
import { styled } from "@mui/material/styles";
import { useState } from 'react'

export default function MapCanvas() {

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
            <Button id='map_undo_button' sx={{minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px'}}>
                <Undo className='toolbar_mui_icon'/>
            </Button>
            <Button id='map_redo_button' sx={{minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px'}}>
                <Redo className='toolbar_mui_icon'/>
            </Button>
        
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
                        <StyledTab label="Palette One"/>
                    </Tabs>
                </Box>
                <Box sx={{padding:2}}>
                    {value === 0 && (
                        <Stack direction='row' spacing={2}>
                            <img src={require("../images/dummyTile1.png")} className='palette_option' bgcolor='red'/>
                            <img src={require("../images/dummyTile2.png")} className='palette_option' bgcolor='blue'/>
                            <img src={require("../images/dummyTile3.png")} className='palette_option' bgcolor='green'/>
                        </Stack>
                    )}
                </Box>
            </Box>
            {/* <canvas id='map_canvas'></canvas> */}
            <img style={{marginTop:'50px', height:'450px', width:'450px'}} src={require('../images/dummyMapPreview.png')} id='map_canvas'/>
        </Box>
    )
}

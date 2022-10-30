import * as React from 'react';
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';
import Box from '@mui/material/Box';
import { borders } from '@mui/system';
import '../../css/explore.css';

export default function Explore() {
    return (
        <Box 
        style={{display:'flex', 
        alignItems: 'flex-start',
        flexDirection: 'column',
        width: '100%'
        }}
        >

            <Box>
            <Button style={{backgroundColor: "#333135", marginLeft: "30px", marginTop: "30px", marginBottom: "30px"}}>
                <div className="button_text">Sort by</div>
                <SortIcon className="button_icons" ></SortIcon>
            </Button>
            <Button style={{backgroundColor: "#333135", marginLeft: "30px", marginTop: "30px", marginBottom: "30px"}}>
                <div className="button_text">Filter by</div>
                <SortIcon className="button_icons" ></SortIcon>
            </Button>
            </Box>

            <Box height="20px"></Box>

            <Box 
            style={{display:'flex', 
            alignItems: 'flex-start',
            flexDirection: 'column', 
            maxHeight: '100%',
            width: '100%',
            overflow: 'auto'}}
            >
                <Box style={{marginBottom:"60px", width: '99%', height: '70%', position: 'relative'}}>
                    <img class='image' src={require("./images/map.jpg")} width="100%" height="100%" border-radius="20%"></img>
                    <div class="overlay">
                        <div class="project_title">Planet Midget</div>
                    </div>
                </Box>
                <Box style={{marginBottom:"60px", width: '99%', height: '70%', position: 'relative'}}>
                    <img class='image' src={require("./images/tile.png")} width="100%" height="100%" border-radius="16px"></img>
                    <div class="overlay">
                        <div class="project_title">Minecraft Copy</div>
                    </div>
                </Box>
            </Box>


        </Box>
    )
}
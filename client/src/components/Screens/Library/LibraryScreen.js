import React from 'react';
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PublicIcon from '@mui/icons-material/Public';
import AddIcon from '@mui/icons-material/Add';
import './css/library.css';

export default function LibraryScreen() {
    return (
        <Box
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                width: '100%',
                height: '100vh',
                backgroundColor: '#1f293a'
            }}
        >

            <Box>
                <Box style={{ display: 'flex', flexDirection: 'row', width: '80vw' }} >
                    <Button style={{ backgroundColor: "#333135", marginLeft: "30px", marginTop: "20px", marginBottom: "20px" }}>
                        <div className="library_button">Sort</div>
                        <SortIcon className="library_button_icons" ></SortIcon>
                    </Button>
                    <Button style={{ backgroundColor: "#333135", marginLeft: "30px", marginTop: "20px", marginBottom: "20px" }}>
                        <div className="library_button">Filter</div>
                        <FilterAltIcon className="library_button_icons" ></FilterAltIcon>
                    </Button>
                    <Box style={{ width: '100%', paddingLeft: '70px', paddingRight:'20px', paddingTop:"10px", display: 'flex', alignItems: 'center', justifyContent:'end', flexDirection: 'row' }} >
                            <Button>
                                <AddIcon sx={{ fontSize: 30, px: 1, color: 'white' }}></AddIcon>
                            </Button>
                    </Box>
                </Box>
            </Box>

            <Box height="20px"></Box>

            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    maxHeight: '100%',
                    width: '100%',
                    overflow: 'auto'
                }}
            >
                <Box sx={{ marginLeft:"20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius:"16px" }} style={{marginBottom: "60px", width: '25%', height: '78%', position: 'relative' }}>
                    <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                    <LockIcon className='library_lock_icon'></LockIcon>
                    <div className="library_overlay">
                        <Box style={{ display: 'flex', flexDirection: 'row' }} >
                            <Box style={{ width:'50%', display: 'flex', flexDirection: 'column' }} >
                                <div className="library_project_title">Planet Midget</div>
                                <div className="library_project_author">by @tomJackson16</div>
                            </Box>
                            <Box style={{ width: '50%', paddingLeft: '70px', paddingRight:'20px', paddingTop:"10px", display: 'flex', alignItems: 'center', justifyContent:'end', flexDirection: 'row' }} >
                                <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                                <FavoriteIcon sx={{ fontSize: 20, px: 1, color: 'cyan' }}></FavoriteIcon>
                                <EditIcon sx={{ fontSize: 20, color: 'gray' }}></EditIcon>
                            </Box>
                        </Box>
                    </div>
                </Box>
                <Box sx={{ marginLeft:"20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius:"16px" }} style={{marginBottom: "60px", width: '25%', height: '78%', position: 'relative' }}>
                    <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                    <LockIcon className='library_lock_icon'></LockIcon>
                    <div className="library_overlay">
                        <Box style={{ display: 'flex', flexDirection: 'row' }} >
                            <Box style={{ width:'50%', display: 'flex', flexDirection: 'column' }} >
                                <div className="library_project_title">Planet Midget Copy</div>
                                <div className="library_project_author">by You</div>
                            </Box>
                            <Box style={{ width: '50%', paddingRight:'20px', paddingTop:"10px", display: 'flex', alignItems: 'center', justifyContent:'end  ', flexDirection: 'row' }} >
                                <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                                <PublicIcon sx={{ fontSize: 20, px: 1, color: 'cyan' }}></PublicIcon>
                                <EditIcon sx={{ fontSize: 20 }}></EditIcon>
                            </Box>
                        </Box>
                    </div>
                </Box>
                <Box sx={{ marginLeft:"20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius:"16px" }} style={{marginBottom: "60px", width: '25%', height: '78%', position: 'relative' }}>
                    <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                    <LockOpenIcon className='library_lock_icon'></LockOpenIcon>
                    <div className="library_overlay">
                        <Box style={{ display: 'flex', flexDirection: 'row' }} >
                            <Box style={{ width:'50%', display: 'flex', flexDirection: 'column' }} >
                                <div className="library_project_title">Planet Midget Public</div>
                                <div className="library_project_author">@tomJackson16</div>
                            </Box>
                            <Box style={{ width: '50%', paddingRight:'20px', paddingTop:"10px", display: 'flex', alignItems: 'center', justifyContent:'end  ', flexDirection: 'row' }} >
                                <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                                <FavoriteIcon sx={{ fontSize: 20, px: 1, color: 'cyan' }}></FavoriteIcon>
                                <EditIcon sx={{ fontSize: 20 }}></EditIcon>
                            </Box>
                        </Box>
                    </div>
                </Box>
                
            </Box>
        </Box>
    )
}
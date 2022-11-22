import React from 'react';
import './css/welcome.css';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PeopleIcon from '@mui/icons-material/People';
import DownloadIcon from '@mui/icons-material/Download';
import ForumIcon from '@mui/icons-material/Forum';
import WorkIcon from '@mui/icons-material/Work';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import SquareIcon from '@mui/icons-material/Square';
import ChatIcon from '@mui/icons-material/Chat';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { GlobalStoreContext } from '../../../store/store'
import { useContext, useEffect, useState } from 'react';
import { CommunityStoreContext } from '../../../store/communityStore';

export default function WelcomeScreen() {
    const { store } = useContext(GlobalStoreContext);
    const { communityStore } = useContext(CommunityStoreContext);

    // let x = db.serverStatus().connections

    store.loadPublicProjects();
    communityStore.getAllThreads();
    let publicProjects = store.publicProjects;
    let threads = communityStore.ALL_THREADS;

    return (
        <div className="welcome_body">
            <Box sx={{ marginLeft:"20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius:"16px" }} style={{marginBottom: "60px", width: '96%', height: '200px', position: 'relative' }}>
                    <img className='welcome_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px" object-fit="cover"></img>
                    <div className="welcome_overlay">
                        <Box style={{ display: 'flex', flexDirection: 'row', justifyContent:'space-between' }} >
                                <div>
                                    <KeyboardArrowLeftIcon sx={{ fontSize: 30, px: 5, pt: 1 }}></KeyboardArrowLeftIcon>
                                </div>
                                <div className="welcome_project_title">Island by tomJackson16</div>
                                <div>
                                    <KeyboardArrowRightIcon sx={{ fontSize: 30, px: 5, pt: 1 }}></KeyboardArrowRightIcon>
                                </div>
                        </Box>
                    </div>
            </Box>

            <div className="welcome_flexbox">
                <MilitaryTechIcon />Island, our currently top-rated map.
            </div>
            <div className="welcome_title_card">
                <div>
                    <span className="welcome_title">Pieces</span>
                    <br />
                    <span className="welcome_title_description">A tilemap and tileset editor.
                    <br />
                    A collaboration service.</span>
                    <br></br>
                    {/* <span className="welcome_call_to_action"><br>
                    </br>Join the Community</span> */}
                    <div className="welcome_call_to_action">
                        <Button>Join the Community</Button>
                    </div>
                </div>
                <div>
                    <div className="welcome_vertical_align">
                            <div className="welcome_stats">
                                <PeopleIcon></PeopleIcon>
                            </div>
                             1,234,567 Users Online
                            <br></br>
                            <div className="welcome_stats">
                                <ForumIcon></ForumIcon>
                            </div>
                            {threads.length} Ongoing Discussions
                            <br></br>
                            <div className="welcome_stats">
                                <DownloadIcon></DownloadIcon>
                            </div>
                            No Download Data
                            <br></br>
                            <div className="welcome_stats">
                                <WorkIcon></WorkIcon>
                            </div>
                            {publicProjects.length} Projects to Collaborate On
                            <br></br>
                        
                    </div>
                </div>
            </div>
            <div className="welcome_section">
                <span className="welcome_section_title">
                    Services
                </span>
            </div>
                <br></br>
                <div className="welcome_title_card">
                    <div>
                        <DesignServicesIcon sx={{ fontSize: "100px" }}></DesignServicesIcon>
                        <br />
                        <span className="welcome_section_subtitle">Map Editor
                        </span>
                        <br></br>
                        <span className="welcome_section_description">From designing a level to downloading maps for your own games, 
                                                                    Pieces has it all. With a state of the art map editing tool, 
                                                                    you will be able to create the most engaging and user delivering maps.</span>

                        <br></br>
                        <SquareIcon sx={{ fontSize: "100px" }}></SquareIcon>
                        <br />
                        <span className="welcome_section_subtitle">Tileset Editor
                        </span>
                        <br></br>
                        <span className="welcome_section_description">Create a tileset for your own map or build off tilesets that already exist. 
                                                                    Pieces is flexible in allowing users to create any tileset of any design.</span>

                        <br></br>
                    </div>
                    <div>
                        <PeopleIcon sx={{ fontSize: "100px" }}></PeopleIcon>
                        <br />
                        <span className="welcome_section_subtitle">Get Feedback
                        </span>
                        <br></br>
                        <span className="welcome_section_description">Make your projects public and receive feedback on your work. 
                                                                    Pieces allows users to view public projects and give feedback. 
                                                                    Additionally, users will be able to contribute and collaborate on projects that are unlocked.</span>
                                                                    
                        <br></br>
                        <ChatIcon sx={{ fontSize: "100px" }}></ChatIcon>
                        <br />
                        <span className="welcome_section_subtitle">Socials
                        </span>
                        <br></br>
                        <span className="welcome_section_description">Add other users as friends, invite them to edit on your projects, 
                                                                    talk to others with our chat service, Pieces has it all.</span>
                                                                    
                        <br></br>
                    </div>
                </div>
            
        </div>
    )
}
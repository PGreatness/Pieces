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
import { Modal, TextField, Grid } from '@mui/material'
import { Input, InputAdornment, Typography } from '@mui/material';
import AuthContext from '../../../auth/auth';

export default function WelcomeScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const { communityStore } = useContext(CommunityStoreContext);
    const [publicProjects, setPublicProjects] = useState([]);
    const [topThreads, setTopThreads] = useState([]);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);

    useEffect(() => {
        store.loadPublicProjects().then(()=>{
            communityStore.getAllThreads().then(()=>{
                setPublicProjects(store.publicProjects)
                setTopThreads(communityStore.ALL_THREADS)
            })
        })
    }, []);

    // let x = db.serverStatus().connections

    const handleOpenRegisterModal = () => {
        setOpenRegisterModal(true)
    }

    const handleCloseRegisterModal = () => {
        setOpenRegisterModal(false)
    }

    const handleRegister = (event) => {
        event.preventDefault();
        handleCloseRegisterModal();

        const formData = new FormData(event.currentTarget);
        auth.registerUser({
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            userName: formData.get('userName'),
            password: formData.get('password'),
            passwordVerify: formData.get('passwordVerify')
        }, store);
    };

    return (
        <div className="welcome_body">
            <Modal
                    open={openRegisterModal}
                    onClose={handleCloseRegisterModal}
                >
                    <Box
                        borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='40%' top='30%' left='30%'
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: "white" }}
                    >

                        <Typography component="h1" variant="h5">
                            Register
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="fname"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                        InputLabelProps={{ style: { color: "white" } }}
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" },
                                            "& .MuiInputBase-root": { color: "azure" }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="lname"
                                        InputLabelProps={{ style: { color: "white" } }}
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" },
                                            "& .MuiInputBase-root": { color: "azure" }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        InputLabelProps={{ style: { color: "white" } }}
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" },
                                            "& .MuiInputBase-root": { color: "azure" }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="userName"
                                        label="User Name"
                                        name="userName"
                                        autoComplete="userName"
                                        InputLabelProps={{ style: { color: "white" } }}
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" },
                                            "& .MuiInputBase-root": { color: "azure" }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="new-password"
                                        InputLabelProps={{ style: { color: "white" } }}
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" },
                                            "& .MuiInputBase-root": { color: "azure" }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        name="passwordVerify"
                                        label="Password Verify"
                                        type="password"
                                        id="passwordVerify"
                                        autoComplete="new-password"
                                        InputLabelProps={{ style: { color: "white" } }}
                                        sx={{
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "azure" },
                                            "& .MuiInputBase-root": { color: "azure" }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Register
                            </Button>
                        </Box>
                    </Box>
                </Modal>
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
                        <Button onClick={handleOpenRegisterModal}>Join the Community</Button>
                    </div>
                </div>
                <div>
                    <div className="welcome_vertical_align">
                            <div className="welcome_stats">
                                <ForumIcon></ForumIcon>
                            </div>
                            {topThreads.length} Ongoing Discussions
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
                        <Typography align="center" sx={{ mx: '10rem' }}>
                            From designing a level to downloading maps for your own games, 
                            Pieces has it all. With a state of the art map editing tool, 
                            you will be able to create the most engaging and user delivering maps.</Typography>
                        <br></br>
                        <SquareIcon sx={{ fontSize: "100px" }}></SquareIcon>
                        <br />
                        <span className="welcome_section_subtitle">Tileset Editor
                        </span>
                        <br></br>
                        <Typography align="center" sx={{ mx: '10rem' }}>
                        Create a tileset for your own map or build off tilesets that already exist. 
                        Pieces is flexible in allowing users to create any tileset of any design.
                        </Typography>

                        <br></br>
                    </div>
                    <div>
                        <PeopleIcon sx={{ fontSize: "100px" }}></PeopleIcon>
                        <br />
                        <span className="welcome_section_subtitle">Get Feedback
                        </span>
                        <br></br>
                        <Typography align="center" sx={{ mx: '10rem' }}>
                        Make your projects public and receive feedback on your work. 
                        Pieces allows users to view public projects and give feedback. 
                        Additionally, users will be able to contribute and collaborate on projects that are unlocked.
                        </Typography>
                                                                    
                        <br></br>
                        <ChatIcon sx={{ fontSize: "100px" }}></ChatIcon>
                        <br />
                        <span className="welcome_section_subtitle">Socials
                        </span>
                        <br></br>
                        <Typography align="center" sx={{ mx: '10rem' }}>
                        Add other users as friends, invite them to edit on your projects, 
                        talk to others with our chat service, Pieces has it all.
                        </Typography>
                                                                    
                        <br></br>
                    </div>
                </div>
            
        </div>
    )
}
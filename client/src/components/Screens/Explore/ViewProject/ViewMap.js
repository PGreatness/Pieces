import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ViewMapTile from './ViewMapTile';
import { GlobalStoreContext } from '../../../../store/store';
import AuthContext from '../../../../auth/auth';
import { useParams, useNavigate } from 'react-router-dom';
export default function ViewMap(props) {

    const { store } = React.useContext(GlobalStoreContext);
    const { auth } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const { id } = useParams();
    const [currentMapTiles, setCurrentMapTiles] = React.useState([]);
    const [map, setMap] = React.useState(null);
    const [mapTiles, setMapTiles] = React.useState([]);
    const [mapWidth, setMapWidth] = React.useState(1);
    const [mapHeight, setMapHeight] = React.useState(1);
    const [owner, setOwner] = React.useState(null);
    const [collaborators, setCollaborators] = React.useState([]);
    const [renderWidthRatio, setRenderWidthRatio] = React.useState(mapWidth / Math.max(mapWidth, mapHeight));
    const [renderHeightRatio, setRenderHeightRatio] = React.useState(mapHeight / Math.max(mapWidth, mapHeight));
    const [isLoading, setIsLoading] = React.useState(true);
    const [value, setValue] = React.useState(0);

    const StyledTab = styled(Tab)({
        "&.Mui-selected": {
            color: "#2dd4cf"
        }
    });

    React.useEffect(() => {
        if (id) {
            auth.getOwnerAndCollaborators(id, true).then((data) => {
                setOwner(data.owner)
                setCollaborators(data.collaborators)
            })
            store.loadMap(id, true).then((map) => {
                setCurrentMapTiles(map.currentMapTiles);
                setMap(map.currentProject);
                setMapWidth(map.width);
                setMapHeight(map.height);
                setMapTiles(map.mapTiles);
                setRenderWidthRatio(map.width / Math.max(map.width, map.height));
                setRenderHeightRatio(map.height / Math.max(map.width, map.height));
                setIsLoading(false);
            });
        }
    }, [id]);

    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        isLoading ?
            <Box className='canvas_container' bgcolor={"#1f293a"} flex={10} sx={{ height: '100vh' }}>
                <div className='loading'>
                    <div className='loading_text'>Loading...</div>
                </div>
            </Box>
            :
            <Box className='canvas_container' bgcolor={"#1f293a"} flex={10} sx={{ height: '100vh' }}>

                <Box bgcolor="#11182a" style={{
                    position: 'absolute', width: '5%', marginLeft: '1%', marginTop: '1%', backgroundColor: 'transparent'
                }}>
                    <KeyboardBackspaceIcon className="back_icon" sx={{ fontsize: '100px !important' }} onClick={() => { props.setLoc('/explore'); navigate('/explore') }}
                    ></KeyboardBackspaceIcon>
                </Box>
                <Grid container direction='row' rowSpacing={0} columns={mapWidth} bgcolor='#000000' style={{ position: 'absolute', height: `${70 * renderHeightRatio}vh`, width: `${70 * renderWidthRatio}vh`, top: '50%', left: '50%', transform: 'translate(-90%, -60%)' }}>
                    {currentMapTiles?.length > 0 && currentMapTiles.map((tile, index) => (
                        <ViewMapTile
                            currentMapTiles={currentMapTiles}
                            mapTiles={mapTiles}
                            mapHeight={mapHeight}
                            mapWidth={mapWidth}
                            index={index}
                        // imgSrc={currentMapTiles[index]}/>
                        />
                    ))}
                </Grid>
                <Box bgcolor={"#11182a"} flex={4} style={{ height: '100vh', width: '30%', borderRadius: '10px 0px 0px 10px', position: 'absolute', right: '0' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        centered
                        TabIndicatorProps={{ style: { backgroundColor: "#2dd4cf" } }}
                        sx={{
                            '& .MuiTab-root': { color: "azure" },
                        }}>

                        <StyledTab label="Properties" />
                        <StyledTab label="Users" />
                    </Tabs>
                </Box>




                {value === 0 && (
                    <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center">
                        <Box className='user_settings_container' style={{ marginTop: '50px' }}>
                            <Stack direction='column'>
                                <Typography style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} variant='h5' color='azure'>Properties</Typography>

                                <Grid container style={{ backgroundColor: "#1f293a", paddingTop: "10px", paddingLeft: '20px', paddingBottom: "30px", marginBottom: '30px' }}>
                                    <Grid item xs={3}>
                                        <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', fontStyle: 'bold', marginTop: '30px', textAlign: 'start' }}>Title:  </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '30px', textAlign: 'start', paddingBottom: "20px" }}>{map.title.length > 20 ? map.title.substring(0, 19) + "..." : map.title}</Typography>
                                    </Grid>
                                    <Divider sx={{ borderBottomWidth: 5, width: '90%' }} />

                                    <Grid item xs={12}>
                                        <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '20px', textAlign: 'start' }}>Description: </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '2px', textAlign: 'start', paddingBottom: "20px" }}>{map.tilesetDesc}</Typography>
                                    </Grid>
                                    <Divider sx={{ borderBottomWidth: 5, width: '90%' }} />


                                    <Grid item xs={7}>
                                        <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '20px', textAlign: 'start' }}>Tileset Count: </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography color='azure' sx={{ paddingLeft: "10px", fontSize: '14px', marginTop: '22px', textAlign: 'start', paddingBottom: "20px" }}>{map.tilesets.length}</Typography>
                                    </Grid>
                                    <Divider sx={{ borderBottomWidth: 5, width: '90%' }} />

                                    <Grid item xs={7}>
                                        <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '20px', textAlign: 'start' }}>Tile Size: </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography color='azure' sx={{ paddingLeft: "0px", fontSize: '14px', marginTop: '22px', textAlign: 'start', paddingBottom: "20px" }}>{map.tileHeight + " x " + map.tileWidth}</Typography>
                                    </Grid>
                                    <Divider sx={{ borderBottomWidth: 5, width: '90%' }} />

                                    <Grid item xs={3}>
                                        <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '20px', textAlign: 'start' }}>Tags: </Typography>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '20px', textAlign: 'start' }}>{map.tags.join(', ')}</Typography>
                                    </Grid>

                                </Grid>



                            </Stack>
                        </Box>
                    </Box>
                )}



                {value === 1 && (
                    <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center">
                        <Box className='user_settings_container' style={{ marginTop: '50px' }}>
                            <Stack direction='column'>
                                <Typography style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} variant='h5' color='azure'>Users</Typography>


                                <Grid item xs={12} sx={{ paddingTop: "20px", paddingLeft: '20px', backgroundColor: "#1f293a" }}>
                                    <Typography color='azure' style={{ fontSize: '14px', textAlign: 'start' }}>Owner</Typography>

                                    <Grid container style={{ backgroundColor: "#1f293a", height: "50px", paddingTop: "10px", }}>
                                        <Grid item xs={2} style={{ paddingLeft: '5px' }}>
                                            <Avatar src={owner?.profilePic?.url}
                                                sx={{
                                                    width: 35,
                                                    height: 35,
                                                    fontSize: "20px",
                                                    bgcolor: "rgb(2, 0, 36)",
                                                    border: "rgba(59, 130, 206, 1) 2px solid"
                                                }}>
                                                {owner?.firstName.charAt(0)}{owner?.lastName.charAt(0)}
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs={10}>
                                            <Typography color='azure' sx={{ paddingLeft: "20px", marginTop: '8px', fontSize: '14px', textAlign: 'start' }}>{owner?.firstName} {owner?.lastName}</Typography>
                                        </Grid>

                                    </Grid>
                                </Grid>

                                <Grid item xs={12} sx={{ paddingTop: "40px", paddingBottom: "30px", marginBottom: '30px', paddingLeft: '20px', backgroundColor: "#1f293a" }}>

                                    {collaborators.length === 0 ?
                                        <Typography color='azure' style={{ fontSize: '14px', paddingBottom: '10px', textAlign: 'start' }}>No Collaborators</Typography>
                                        :
                                        <>
                                            <Typography color='azure' style={{ fontSize: '14px', paddingBottom: '10px', textAlign: 'start' }}>Collaborators</Typography>

                                            {collaborators.map((collabUser) => (

                                                <Grid container style={{ backgroundColor: "#1f293a", height: "60px", paddingTop: "10px", }}>
                                                    <Grid item xs={2} style={{ paddingLeft: '5px' }}>
                                                        <Avatar src={collabUser?.profilePic?.url}
                                                            sx={{
                                                                width: 35,
                                                                height: 35,
                                                                fontSize: "20px",
                                                                bgcolor: "rgb(2, 0, 36)",
                                                                border: "rgba(59, 130, 206, 1) 2px solid"
                                                            }}>
                                                            {collabUser.firstName.charAt(0)}{collabUser.lastName.charAt(0)}
                                                        </Avatar>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <Typography color='azure' sx={{ paddingLeft: "20px", marginTop: '8px', fontSize: '20px', textAlign: 'start' }}>{collabUser.firstName} {collabUser.lastName}</Typography>
                                                    </Grid>
                                                    <Grid item xs={2}>
                                                    </Grid>

                                                </Grid>
                                            ))}
                                        </>
                                    }

                                </Grid>


                            </Stack>
                        </Box>
                    </Box>
                )}
            </Box>
            </Box>
    );
}
import React from 'react';
import { Box, Stack } from '@mui/system';
import { Modal, Typography, Button, Tabs, Tab, Grid } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Avatar } from "@mui/material";
import Divider from '@mui/material/Divider';
import { styled } from "@mui/material/styles";
import { GlobalStoreContext } from '../../../../store/store';
import AuthContext from '../../../../auth/auth'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function ViewTileset(props) {

    const { store } = React.useContext(GlobalStoreContext);
    const { auth } = React.useContext(AuthContext)

    const { id } = useParams();
    const [tileset, setTileset] = React.useState([])
    const [currentTile, setCurrentTile] = React.useState(null);
    const [owner, setOwner] = React.useState(null);
    const [collaborators, setCollaborators] = React.useState([]);
    const [width, setWidth] = React.useState(currentTile ? currentTile.width : 0)
    const [value, setValue] = React.useState(0);

    const [isLoading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (id) {
            store.loadTileset(id, true).then((res) => {
                console.log(res.currentTile)
                setTileset(res.currentProject)
                setCurrentTile(res.currentTile);
                setWidth(res.currentTile.width)
                setLoading(false);
            });

            auth.getOwnerAndCollaborators(id, false).then((data) => {
                setOwner(data.owner)
                setCollaborators(data.collaborators)
            })
        }
    }, [id]);

    const handleSelectTile = async (tileId) => {
        //await store.setCurrentTile(tileId)
        //setCurrentTile(store.currentTile)
        let tile = await store.getTileById(tileId)
        setCurrentTile(tile);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const StyledTab = styled(Tab)({
        "&.Mui-selected": {
            color: "#2dd4cf"
        }
    });

    if (isLoading) {
        return (
            <Box className='canvas_container' bgcolor={"#1f293a"} flex={10}
                style={{ position: 'fixed', height: '92vh', width: '100vw' }}
            >
                <div >Loading...</div>
            </Box>
        )
    } else {
        return (
            <Box className='canvas_container' bgcolor={"#1f293a"} flex={10}
                style={{ position: 'fixed', height: '92vh', width: '100vw' }}
            >
                {/* <Box style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '10%', alignItems: 'center' }}>
                    <KeyboardBackspaceIcon className="back_icon"></KeyboardBackspaceIcon>
                    <div className="comment_title">View Tileset</div>
                </Box> */}

                <Stack direction="row" justifyContent='space-between'>

                    <Box bgcolor="#11182a" style={{
                        position: 'absolute', width: '5%', marginLeft: '1%', marginTop: '1%', backgroundColor: 'transparent'
                    }}>
                        <KeyboardBackspaceIcon className="back_icon" sx={{ fontsize: '100px !important' }} onClick={() => { props.setLoc('/explore'); navigate('/explore') }}
                        ></KeyboardBackspaceIcon>
                    </Box>


                    <Box style={{ display: 'flex', flexDirection: 'row', height: '92vh', width: '70%' }}>

                        {currentTile
                            ? <Grid container direction='row' id='tileset-canvas-grid'
                                rowSpacing={0} columns={width} bgcolor='#000000'
                                style={{ position: 'absolute', height: '65vh', width: '65vh', top: '7%', left: '18%' }}
                            // style={{ position: 'absolute', height: '65vh', width: '65vh', top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }}
                            >
                                {currentTile.tileData.map((pixel, index) => (
                                    pixel === ''
                                        ? <Grid id={`pixel_${index}`} item xs={1} style={{ borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.05)', borderWidth: '0.5px', height: `calc(100% / ${width}` }} bgcolor='#fff'></Grid>
                                        : <Grid id={`pixel_${index}`} item xs={1} style={{ height: `calc(100% / ${width}` }} bgcolor={pixel}></Grid>
                                ))}
                            </Grid>
                            : null
                        }

                        <Box bgcolor="#11182a" style={{
                            position: 'absolute', width: '60%', borderRadius: '0px 10px 0px 0px',
                            marginLeft: '5%', backgroundColor: "#11182a", bottom: '0%', height: '18%'
                        }}>
                            <Box bgcolor="#11182a"
                                //style={{ borderRadius: '15px 15px 0px 0px', height: '30px', width: '15%', }}
                                style={{ width: '15%', position: 'absolute', bottom: '100%' }}
                            >
                                <Typography style={{ color: 'azure' }}>Tileset</Typography>
                            </Box>
                            <Box sx={{ padding: 2 }}>
                                <Stack direction='row' sx={{ overflowX: 'scroll' }}>

                                    {tileset && tileset.tiles?.length > 0
                                        ? tileset?.tiles.map((tileId) => (
                                            <Box className='tile_option'>
                                                <img src={require('../../../Editors/images/dummyTilePreview.png')} className='tile_option_image' />
                                                <Button style={{ padding: '0px', maxWidth: '100%', top: '0px', left: '0px', minWidth: '100%' }} className='tile_option_select' onClick={() => handleSelectTile(tileId)}></Button>
                                            </Box>
                                        ))
                                        : null
                                    }
                                </Stack>

                            </Box>
                        </Box>
                    </Box>

                    <Box bgcolor={"#11182a"} flex={4} style={{ height: '92vh', width: '30%', marginTop: '12px', borderRadius: '10px 0px 0px 10px' }}>
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
                                                <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '30px', textAlign: 'start', paddingBottom: "20px" }}>{tileset.title.length > 20 ? tileset.title.substring(0, 19) + "..." : tileset.title}</Typography>
                                            </Grid>
                                            <Divider sx={{ borderBottomWidth: 5, width: '90%' }} />

                                            <Grid item xs={12}>
                                                <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '20px', textAlign: 'start' }}>Description: </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '2px', textAlign: 'start', paddingBottom: "20px" }}>{tileset.tilesetDesc}</Typography>
                                            </Grid>
                                            <Divider sx={{ borderBottomWidth: 5, width: '90%' }} />


                                            <Grid item xs={7}>
                                                <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '20px', textAlign: 'start' }}>Tile Count: </Typography>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <Typography color='azure' sx={{ paddingLeft: "10px", fontSize: '14px', marginTop: '22px', textAlign: 'start', paddingBottom: "20px" }}>{tileset.tiles.length}</Typography>
                                            </Grid>
                                            <Divider sx={{ borderBottomWidth: 5, width: '90%' }} />

                                            <Grid item xs={7}>
                                                <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '20px', textAlign: 'start' }}>Tile Size: </Typography>
                                            </Grid>
                                            <Grid item xs={5}>
                                                <Typography color='azure' sx={{ paddingLeft: "0px", fontSize: '14px', marginTop: '22px', textAlign: 'start', paddingBottom: "20px" }}>{tileset.tileHeight + " x " + tileset.tileWidth}</Typography>
                                            </Grid>
                                            <Divider sx={{ borderBottomWidth: 5, width: '90%' }} />

                                            <Grid item xs={3}>
                                                <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '20px', textAlign: 'start' }}>Tags: </Typography>
                                            </Grid>
                                            <Grid item xs={9}>
                                                <Typography color='azure' sx={{ paddingLeft: "20px", fontSize: '14px', marginTop: '20px', textAlign: 'start' }}>{tileset.tilesetTags.join(', ')}</Typography>
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
                                                            fontSize: "15px",
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
                                                                <Typography color='azure' sx={{ paddingLeft: "20px", marginTop: '8px', fontSize: '14px', textAlign: 'start' }}>{collabUser.firstName} {collabUser.lastName}</Typography>
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
                </Stack>
            </Box >

        );
    }
}
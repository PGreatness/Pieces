import * as React from 'react';
import { styled } from '@mui/material/styles';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import MapIcon from '@mui/icons-material/Map';
import GridViewIcon from '@mui/icons-material/GridView';
import { Modal, TextField, Grid, Typography, Box, Button, Input } from '@mui/material'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useNavigate } from 'react-router-dom';
import { GlobalStoreContext } from '../../store/store'
import AuthContext from '../../auth/auth'
import { useContext, useState, useRef } from 'react'

// const { auth } = useContext(AuthContext);

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        top: theme.spacing(2),
        left: theme.spacing(2),
    },
}));



export default function CreateButton(props) {

    const navigate = useNavigate();
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const [openCreateMapModal, setOpenCreateMapModal] = useState(false)
    const [openCreateTilesetModal, setOpenCreateTilesetModal] = useState(false)
    const [image, setImage] = useState(null)
    const inputRef = useRef(null);

    const setLocation = (loc) => {
        props.setLoc(loc);
        navigate(loc);
    }

    const handleOpenFileInput = () => {
        inputRef.current.click();
    }


    const handleFileChange = async function (event) {
        let image = event.target.files[0];
        console.log(image)
        setImage(image.name)
    };

    const handleCreateNewMap = async () => {
        let title = document.getElementById('map_name_input').value
        let mapHeight = Number(document.getElementById('map_height_input').value)
        let mapWidth = Number(document.getElementById('map_width_input').value)
        let tileHeight = Number(document.getElementById('tile_height_input').value)
        let tileWidth = Number(document.getElementById('tile_width_input').value)
        let ownerId = auth.user._id

        if (mapHeight === NaN || mapWidth === NaN || tileHeight === NaN || tileWidth === NaN) {
            console.log("Not a valid number.")
        }
        else {
            let response = await store.createNewMap(title, mapHeight, mapWidth, tileHeight, tileWidth, ownerId)
            console.log(response)
            if (response.data.success)
                setLocation(`/map/${response.data.id}`)
            store.changePageToMapEditor(response.data.map)
        }
        setOpenCreateMapModal(false)
    }

    const handleCreateNewTileset = async () => {
        let title = document.getElementById('tileset_name_input').value
        let tilesetHeight = Number(document.getElementById('tileset_height_input').value)
        let tilesetWidth = 5;
        let tileHeight = 5;
        let tileWidth = Number(document.getElementById('ts_tile_width_input').value)
        let ownerId = auth.user._id

        if (tilesetHeight === NaN || tilesetWidth === NaN || tileHeight === NaN || tileWidth === NaN) {
            console.log("Not a valid number.")
        }
        else {
            let response = await store.createNewTileset(title, tilesetHeight, tilesetWidth, tileHeight, tileWidth, ownerId)
            console.log(response)
            //setLocation(`/tileset/${response.data.tileset._id}`)
            //store.changePageToTilesetEditor(response.data.tileset)

            await store.loadTileset(response.data.tileset._id).then
            console.log(store)

            await store.changePageToTilesetEditor(response.data.tileset)
            console.log(store.currentPage)

            setLocation(`/tileset/${response.data.tileset._id}`)



        }
        setOpenCreateTilesetModal(false)
    }

    const handleOpenCreateMapModal = () => {
        setOpenCreateMapModal(true)
    }

    const handleCloseCreateMapModal = () => {
        setOpenCreateMapModal(false)
    }

    const handleOpenCreateTilesetModal = () => {
        setOpenCreateTilesetModal(true)
    }

    const handleCloseCreateTilesetModal = () => {
        setImage(null)
        setOpenCreateTilesetModal(false)
    }

    const actions = [
        { icon: <MapIcon />, name: 'Create a new Map', action: () => handleOpenCreateMapModal() },
        { icon: <GridViewIcon />, name: 'Create a new Tileset', action: () => handleOpenCreateTilesetModal() },
    ];

    return (
        <div>
            <StyledSpeedDial
                ariaLabel="SpeedDial playground example"
                icon={<SpeedDialIcon />}
                direction='up'
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={action.action}
                    />
                ))}
            </StyledSpeedDial>
            <Modal
                open={openCreateMapModal}
                onClose={handleCloseCreateMapModal}
            >
                <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='50%' height='50%' top='30%' left='30%'>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px' }} variant='h5' color='azure'>Create Map</Typography>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px', marginRight: '10px' }} color='azure'>Map Name:</Typography>
                            <TextField id='map_name_input' size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20 } }} />
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} item xs={4}>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px', marginRight: '10px' }} color='azure'>Map Height:</Typography>
                            <TextField id="map_height_input" size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20, width: 60 } }} />
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} item xs={4}>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px', marginRight: '10px' }} color='azure'>Map Width:</Typography>
                            <TextField id="map_width_input" size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20, width: 60 } }} />
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={2}></Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} item xs={4}>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px', marginRight: '10px' }} color='azure'>Tile Height:</Typography>
                            <TextField id="tile_height_input" size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20, width: 60 } }} />
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} item xs={4}>
                            <Typography style={{ textAlign: 'center', marginBottom: '5px', marginRight: '10px' }} color='azure'>Tile Width:</Typography>
                            <TextField id="tile_width_input" size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20, width: 60 } }} />
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={2}></Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} item xs={4}>
                            <Button onClick={handleCloseCreateMapModal}>
                                Close
                            </Button>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} item xs={4}>
                            <Button onClick={handleCreateNewMap}>
                                Confirm
                            </Button>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Box>
            </Modal>
            <Modal
                open={openCreateTilesetModal}
                onClose={handleCloseCreateTilesetModal}
            >
                <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='50%' height='50%' top='30%' left='30%'>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '50px' }} variant='h3' color='azure'>Create Tileset</Typography>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }} item xs={12}>
                            <Typography style={{ fontSize: '25px', textAlign: 'center', marginRight: '10px' }} color='azure'>Tileset Name:</Typography>
                            <TextField id='tileset_name_input' size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
                                sx={{ "& .MuiInputBase-root": { height: 40, width: 300 } }} />
                        </Grid>

                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }} item xs={12}>
                            <input
                                style={{ display: 'none' }}
                                ref={inputRef}
                                type="file"
                                onChange={handleFileChange}
                            />
                            <TextField 
                                value={image? image : "Import Tileset..."}
                                InputProps={{
                                    readOnly: true,
                                }} 
                                style={{ backgroundColor: 'azure', borderRadius: 10 }}
                                sx={{ "& .MuiInputBase-root": { height: 40, width: 400, fontSize: '20px' } }}
                            />

                            <Button onClick={handleOpenFileInput}>
                                <DriveFolderUploadIcon style={{
                                    fontSize: "60px",
                                    marginLeft: '10px', color: 'white'
                                }} />
                            </Button>

                        </Grid>

                        <Grid item xs={3}></Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} item xs={4}>
                            <Typography style={{ fontSize: '20px', textAlign: 'center', marginRight: '12px' }} color='azure'>Tile Height:</Typography>
                            <TextField id="ts_tile_height_input" size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
                                sx={{ "& .MuiInputBase-root": { height: 40, width: 70 } }} />
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} item xs={3}>
                            <Typography style={{ fontSize: '20px', textAlign: 'center', marginRight: '12px' }} color='azure'>Tile Width:</Typography>
                            <TextField id="ts_tile_width_input" size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
                                sx={{ "& .MuiInputBase-root": { height: 40, width: 70 } }} />
                        </Grid>
                        <Grid item xs={2}></Grid>


                        <Grid item xs={2}></Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }} item xs={4}>
                            <Button sx={{ fontSize: '20px' }} onClick={handleCloseCreateTilesetModal}>
                                Close
                            </Button>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }} item xs={4}>
                            <Button sx={{ fontSize: '20px' }} onClick={handleCreateNewTileset}>
                                Confirm
                            </Button>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Box>
            </Modal>


        </div>
    );
}
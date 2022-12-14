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
    // const [openInvalidDimensionsModal, setOpenInvalidDimensionsModal] = useState(false)
    const [image, setImage] = useState(null)
    const [showError, setShowError] = useState(false)
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
        setImage(image)
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
            if (response.data.success) {
                //await store.changePageToMapEditor(response.data.map)
                await store.loadMap(response.data.map._id)
                setLocation(`/map/${response.data.id}`)
            }
        }
        setOpenCreateMapModal(false)
    }

    const handleCreateNewTileset = async () => {
        let title = document.getElementById('tileset_name_input').value
        let tilesetHeight = Number(5);
        let tilesetWidth = Number(5);
        let tileHeight = Number(document.getElementById('ts_tile_height_input').value);
        let tileWidth = Number(document.getElementById('ts_tile_width_input').value)
        let ownerId = auth.user._id
        let hexArray = []


        if (image) {

            var context = document.getElementById('canvas').getContext('2d');
            var img = new Image()
            img.src = URL.createObjectURL(image);

            img.onload = async function () {

                // Check if the dimensions are correct
                let iw = img.width
                let ih = img.height

                tilesetHeight = ih
                tilesetWidth = iw
                console.log(`Image Height: ${ih}, Image Width: ${iw}, Tile Height: ${tileHeight}, Tile Width: ${tileWidth}`)
                if (iw % tileWidth !== 0 || ih % tileHeight !== 0) {
                    setShowError(true)
                    return
                }

                context.drawImage(img, 0, 0)
                var imgd = context.getImageData(0, 0, iw, ih);
                var pix = imgd.data;
                console.log("Image Data:")
                console.log(pix)

                function componentToHex(c) {
                    var hex = c.toString(16);
                    return hex.length == 1 ? "0" + hex : hex;
                }

                for (var i = 0; i < pix.length; i += 4) {
                    if (pix[i + 3] == 255) {
                        let r = componentToHex(pix[i])
                        let g = componentToHex(pix[i + 1])
                        let b = componentToHex(pix[i + 2])

                        hexArray.push(`#${r}${g}${b}`)
                    } else {
                        hexArray.push('')
                    }
                }

                console.log("RGBARRAY")
                console.log(hexArray)

                // EXAMPLE IMAGE = img.height: 6, img.width: 6)
                // tile height : 3,  tile width : 2

                // hexArray[0]  hexArray[1]    |  hexArray[2] hexArray[3]   | hexArray[4]   hexArray[5]
                // hexArray[6]  hexArray[7]   |  hexArray[8] hexArray[9]   | hexArray[10]  hexArray[11]
                // hexArray[12] hexArray[13] |  hexArray[14] hexArray[15] | hexArray[16]  hexArray[17]
                // ==================================================================================
                // hexArray[18] hexArray[19] | hexArray[20] hexArray[21] | hexArray[22]  hexArray[23]
                // hexArray[24] hexArray[25] | hexArray[26] hexArray[27] | hexArray[28]  hexArray[29]
                // hexArray[30] hexArray[31] | hexArray[32] hexArray[33] | hexArray[34]  hexArray[35]
                // ==================================================================================
                // hexArray[36] hexArray[37] |  hexArray[38] hexArray[39] | hexArray[40]  hexArray[41]
                // hexArray[42] hexArray[43] |  hexArray[44] hexArray[45] | hexArray[46]  hexArray[47]
                // hexArray[48] hexArray[49] |  hexArray[50] hexArray[51] | hexArray[52]  hexArray[53]

                let tiles = []
                let check = img.width - tileWidth
                for (i = 0; i < (img.height * img.width); i += tileWidth) {
                    let tile = []
                    for (let j = i; j < (tileHeight * img.width) + i; j += img.width) {
                        tile.push(hexArray.slice(j, j + tileWidth))
                    }
                    // concat each array in tile
                    tiles.push(tile.flat())
                    if (i === (check)) {
                        check += (tileHeight * img.width)
                        i += ((tileHeight - 1) * img.width)
                    }
                }

                // Create new tileset
                let response = await store.createNewTileset(title, tilesetHeight, tilesetWidth, tileHeight, tileWidth, ownerId)

                const convertToImage = (tileData) => {
                    let rgba = []
          
                    tileData.forEach((tile) => {
                      if (tile.length === 0) {
                        rgba.push(0)
                        rgba.push(0)
                        rgba.push(0)
                        rgba.push(0)
                      } else {
                        var bigint = parseInt(tile.slice(1), 16);
                        var r = (bigint >> 16) & 255;
                        var g = (bigint >> 8) & 255;
                        var b = bigint & 255;
                        rgba.push(r)
                        rgba.push(g)
                        rgba.push(b)
                        rgba.push(255)
          
                      }
                    })
          
                    var rgbaArray = new ImageData(new Uint8ClampedArray(rgba), response.data.tileset.tileWidth, response.data.tileset.tileHeight);
          
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    canvas.height = response.data.tileset.tileHeight
                    canvas.width = response.data.tileset.tileWidth
          
                    context.putImageData(rgbaArray, 0, 0);
                    var imgSrc = canvas.toDataURL();
                    canvas.remove();
                    return imgSrc
                  }

                // Create new tiles to go into tileset
                for (let i = 0; i < tiles.length; i++) {
                    let imgSrc = convertToImage(tiles[i]);
                    let createTileResponse = await store.createTile(response.data.tileset._id, response.data.tileset.tileHeight, response.data.tileset.tileWidth, tiles[i], imgSrc)
                    console.log(createTileResponse)
                }

                // Navigate to tileset
                store.changePageToTilesetEditor(response.data.tileset).then(() => {
                    store.loadTileset(response.data.tileset._id).then(() => {
                        setLocation(`/tileset/${response.data.tileset._id}`);
                    })
                })

            }
        }
        else {
            if (tilesetHeight === NaN || tilesetWidth === NaN || tileHeight === NaN || tileWidth === NaN) {
                console.log("Not a valid number.")
            }
            else {
                let response = await store.createNewTileset(title, tilesetHeight, tilesetWidth, tileHeight, tileWidth, ownerId)

                // Navigate to tileset
                store.changePageToTilesetEditor(response.data.tileset).then(() => {
                    store.loadTileset(response.data.tileset._id).then(() => {
                        setLocation(`/tileset/${response.data.tileset._id}`);
                    })
                })
            }
        }

    }

    // const handleOpenInvalidDimensionsModal = () => {
    //     setOpenInvalidDimensionsModal(true)
    // }

    // const handleCloseInvalidDimensionsModal = () => {
    //     setOpenInvalidDimensionsModal(false)
    // }

    const handleOpenCreateMapModal = () => {
        setOpenCreateMapModal(true)
    }

    const handleCloseCreateMapModal = () => {
        setOpenCreateMapModal(false)
    }

    const handleOpenCreateTilesetModal = () => {
        setOpenCreateTilesetModal(true)
        setShowError(false)
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
                <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='50%' top='25%' left='30%'>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '80px' }} variant='h3' color='azure'>Create Map</Typography>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '50px' }} item xs={12}>
                            <Typography style={{ fontSize: '25px', textAlign: 'center', marginRight: '10px' }} color='azure'>Map Name:</Typography>
                            <TextField id='map_name_input' size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
                                sx={{ "& .MuiInputBase-root": { height: 40, width: 300 } }} />
                        </Grid>

                        <Grid item xs={2}></Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }} item xs={4}>
                            <Typography style={{ fontSize: '20px', textAlign: 'center', marginRight: '12px' }} color='azure'>Map Height:</Typography>
                            <TextField id="map_height_input" size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
                                sx={{ "& .MuiInputBase-root": { height: 40, width: 70 } }} />
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '20px' }} item xs={4}>
                            <Typography style={{ fontSize: '20px', textAlign: 'center', marginRight: '12px' }} color='azure'>Map Width:</Typography>
                            <TextField id="map_width_input" size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
                                sx={{ "& .MuiInputBase-root": { height: 40, width: 70 } }} />
                        </Grid>
                        <Grid item xs={2}></Grid>



                        <Grid item xs={2}></Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} item xs={4}>
                            <Typography style={{ fontSize: '20px', textAlign: 'center', marginRight: '12px' }} color='azure'>Tile Height:</Typography>
                            <TextField id="tile_height_input" size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
                                sx={{ "& .MuiInputBase-root": { height: 40, width: 70 } }} />
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} item xs={4}>
                            <Typography style={{ fontSize: '20px', textAlign: 'center', marginRight: '12px' }} color='azure'>Tile Width:</Typography>
                            <TextField id="tile_width_input" size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
                                sx={{ "& .MuiInputBase-root": { height: 40, width: 70 } }} />
                        </Grid>
                        <Grid item xs={2}></Grid>


                        <Grid item xs={2}></Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }} item xs={4}>
                            <Button sx={{ fontSize: '20px' }} onClick={handleCloseCreateMapModal}>
                                Close
                            </Button>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }} item xs={4}>
                            <Button sx={{ fontSize: '20px' }} onClick={handleCreateNewMap}>
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
                <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='50%' top='25%' left='30%'>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography style={{ textAlign: 'center', marginBottom: '80px' }} variant='h3' color='azure'>Create Tileset</Typography>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }} item xs={12}>
                            <Typography style={{ fontSize: '25px', textAlign: 'center', marginRight: '10px' }} color='azure'>Tileset Name:</Typography>
                            <TextField id='tileset_name_input' size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
                                sx={{ "& .MuiInputBase-root": { height: 40, width: 300 } }} />
                        </Grid>

                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }} item xs={12}>
                            <input
                                style={{ display: 'none' }}
                                ref={inputRef}
                                type="file"
                                onChange={handleFileChange}
                            />
                            <TextField
                                value={image ? image.name : "Import Tileset..."}
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

                        <Grid item xs={12}>
                            <Typography style={{ fontSize: '15px', textAlign: 'center', marginBottom: '20px' }} color='red'>
                                {showError ? 'The given tileset image could not be split into tiles of the given dimensions. Please try again.' : ''}
                            </Typography>
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
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }} item xs={4}>
                            <Button sx={{ fontSize: '20px' }} onClick={handleCloseCreateTilesetModal}>
                                Close
                            </Button>
                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }} item xs={4}>
                            <Button sx={{ fontSize: '20px' }} onClick={handleCreateNewTileset}>
                                Confirm
                            </Button>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Box>
            </Modal>
            {/* 

            <Modal
                open={openInvalidDimensionsModal}
                onClose={handleCloseInvalidDimensionsModal}
            >
                <Box
                    borderRadius='10px' padding='10px' bgcolor='#11182a' position='absolute' width='50%' top='25%' left='30%'
                >
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography style={{ textAlign: 'center',  marginTop:'10px'}} variant='h4' color='azure'>Upload Failed</Typography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
                            <Typography style={{ fontSize: '18px', textAlign: 'center', marginTop:'20px', marginBottom:'20px' }} color='azure'>The given tileset image could not be split into tiles of the given dimensions.</Typography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid style={{display:'flex', justifyContent: 'center', alignItems: 'center'}} item xs={12}>
                            <Button onClick={handleCloseInvalidDimensionsModal}>Okay</Button>        
                        </Grid>
                    </Grid>
                </Box>
            </Modal> */}


            <canvas style={{ display: 'none' }} id='canvas'></canvas>

        </div>
    );
}
import React from 'react'
import { useState, useContext, useEffect, useRef } from 'react';
import { Box, Stack } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Modal, Slider, TextField, Tab, Tabs, Typography, Grid, Button } from '@mui/material'
import { Edit, IosShare, Clear, AddBox, LibraryAdd, Check, Add } from '@mui/icons-material'
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import PublicIcon from '@mui/icons-material/Public';
import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'
import { TabPanel, TabContext, TabList } from '@mui/lab'
import { GlobalStoreContext } from '../../../store/store'
import AuthContext from '../../../auth/auth';
import { styled } from "@mui/material/styles";
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';
import UserModalItem from './UserModalItem';
import { Form } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import MapTile from './MapTile.js'

import './css/mapRightBar.css';

export default function MapRightBar(props) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  //console.log(store.currentProject)
  //const project = store.currentProject;

  const [project, setProject] = useState(store.currentProject);
  const [value, setValue] = useState(0);
  const [openImportMap, setOpenImportMap] = useState(false);
  const [openExportMap, setOpenExportMap] = useState(false);
  const [openImportTileset, setOpenImportTileset] = useState(false);
  const [openPublishMap, setOpenPublishMap] = useState(false);
  const [openUnpublishMap, setOpenUnpublishMap] = useState(false);
  const [openDeleteMap, setOpenDeleteMap] = useState(false);
  const [owner, setOwner] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [favs, setFavs] = useState(store.userFavs);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [users, setUsers] = useState([]);
  const [image, setImage] = useState(null)
  const [showError, setShowError] = useState(false)
  const inputRef = useRef(null);

  const navigate = useNavigate();
  // console.log(owner)
  // console.log(collaborators)
  // console.log(project)

  useEffect(() => {
    setProject(store.currentProject)
    auth.getOwnerAndCollaborators(project._id, true).then((data) => {
      setOwner(data.owner);
      setCollaborators(data.collaborators);
    })
  }, [store.currentProject])

  useEffect(() => {
    setFavs(store.userFavs)
  }, [store.userFavs])

  const handleChange = (event, newValue) => {
    if (newValue === 1) {
      handleOpenUserSettings()
    } else {
      handleCloseUserSettings();
    }
    setValue(newValue);
  }

  const StyledTab = styled(Tab)({
    "&.Mui-selected": {
      color: "#2dd4cf"
    }
  });


  const handleOpenImportMap = () => {
    setOpenImportMap(true)
  }

  const handleCloseImportMap = () => {
    setOpenImportMap(false)
  }

  const handleOpenFileInput = () => {
    inputRef.current.click();
  }


  const handleFileChange = async function (event) {
    let image = event.target.files[0];
    console.log(image)
    setImage(image)
  };

  const handleOpenExportMap = () => {
    setOpenExportMap(true)
  }

  const handleCloseExportMap = () => {
    setOpenExportMap(false)
  }

  const handleOpenImportTileset = async () => {
    await store.loadFavorites(auth.user._id, project._id);
    setOpenImportTileset(true)
  }

  const handleCloseImportTileset = () => {
    setImage(null)
    setShowError(false)
    setOpenImportTileset(false)
  }

  const handleOpenUserSettings = async function () {
    auth.getOwnerAndCollaborators(project._id, true).then((data) => {
      setOwner(data.owner);
      setCollaborators(data.collaborators);
    })

    const users = await auth.getAllUsers();
    setUsers(users)
    console.log(users)
  }

  const handleCloseUserSettings = async function () {
    setCollaborators([])
  }

  const handlePublishMap = () => {
    setOpenPublishMap(true)
  }

  const handleClosePublishMap = () => {
    setOpenPublishMap(false)
  }

  const publishMap = () => {
    store.publishMap();
    handleClosePublishMap();
  }

  const handleUnpublishMap = () => {
    setOpenUnpublishMap(true)
  }

  const handleCloseUnpublishMap = () => {
    setOpenUnpublishMap(false)
  }

  const unpublishMap = () => {
    store.unpublishMap();
    handleCloseUnpublishMap();
  }

  const handleDeleteMap = () => {
    setOpenDeleteMap(true)
  }

  const handleCloseDeleteMap = () => {
    setOpenDeleteMap(false)
  }

  const handleImportTileset = (tileset) => {
    store.importTilesetToMap(tileset._id);
    handleCloseImportTileset();
  }

  const deleteMap = () => {
    //store.unpublishMap();
    handleCloseDeleteMap();
    store.deleteMap(project._id);
    props.setLoc('/library');
    navigate('/library');
  }

  const handleAddCollaborator = async (e, value, reason) => {
    if (reason === 'selectOption') {
      await auth.getUserByUsername(value, (user) => {
        store.addMapCollaborator(project._id, user._id)
          .then(() => console.log(store))
          .catch((err) => console.log(err))
      })
    }
  }

  const removeCollaborator = async function (id) {
    let newMap = await store.removeMapCollaborator(project._id, id);
    console.log(project)
  }

  const handleImportImageTileset = async () => {
    // let title = document.getElementById('tileset_name_input').value
    let tilesetHeight = Number(5);
    let tilesetWidth = Number(5);
    let tileHeight = Number(document.getElementById('ts_tile_height_input').value);
    let tileWidth = Number(document.getElementById('ts_tile_width_input').value)
    let ownerId = auth.user._id
    let hexArray = []

    if (image) {

      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var img = new Image()
      console.log(image);
      img.src = URL.createObjectURL(image);
      console.log(img);

      img.onload = async function () {

        // Check if the dimensions are correct
        let iw = img.width
        let ih = img.height

        tilesetHeight = ih
        tilesetWidth = iw
        console.log(`Image Height: ${ih}, Image Width: ${iw}, Tile Height: ${tileHeight}, Tile Width: ${tileWidth}`)
        if (iw % tileWidth !== 0 || ih % tileHeight !== 0) {
          console.log("error was found")
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
        
        
        // TODO: CALL STORE FUNCTION TO :
        // 1. CREATE NEW TILES 
        // 2. CREATE NEW TILESET
        // 3. ADD TILES TO TILESET
        // 2. ADD TILESET TO CURRENT MAP

        // Create new tileset
        let response = await store.createNewTileset(image.name.slice(0, -4), tilesetHeight, tilesetWidth, tileHeight, tileWidth, ownerId)
        let newTileset = response.data.tileset

        // Create new tiles to go into tileset
        for (let i = 0; i < tiles.length; i++) {
          let createTileResponse = await store.createTile(newTileset._id, tileHeight, tileWidth, tiles[i])
          console.log(createTileResponse)
        }


        await store.importTilesetToMap(newTileset._id);
        canvas.remove();
        handleCloseImportTileset();
      }
    }

  }

  return (
    <Box bgcolor={"#11182a"} flex={4} className="map_rightbar">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          TabIndicatorProps={{ style: { backgroundColor: "#2dd4cf" } }}
          sx={{
            '& .MuiTab-root': { color: "azure" },
          }}>

          <StyledTab label="Editor" />
          <StyledTab label="Social" />
          <StyledTab label="Settings" />
        </Tabs>
      </Box>




      <Box sx={{ padding: 2, height: '80%' }}>
        {value === 0 && (
          <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center">

            <Typography color='azure' variant='h4'
              sx={{ marginTop: '10px', marginLeft: '15px', marginRight: '15px' }}>Map: {store.currentProject.title}</Typography>

            <Box bgcolor="#ffffff" className="previewWindow" sx={{ marginTop: '30px', marginBottom: '30px' }}>
              <Stack direction='column' textAlign='center'>
                <Typography bgcolor="#1f293a" color='azure'>Preview</Typography>
                <Grid container direction='row' rowSpacing={0} columns={store.currentProject.mapWidth} bgcolor='#000000' style={{ height: `250px`, width: `250px` }}>
                  {store.currentMapTiles.length > 0 && store.currentMapTiles.map((tile, index) => (
                    <MapTile index={index} />
                  ))}
                </Grid>
              </Stack>
            </Box>
            <Box>
              <Button onClick={handleOpenImportTileset} sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: '#2dd4cf' }}>
                <Typography>Import Tileset</Typography>
                <LibraryAdd style={{ marginLeft: '15px' }} />
              </Button>
            </Box>
          </Box>
        )}
        {value === 1 && (
          <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center">
            <Box className='user_settings_container'>
              <Stack direction='column'>
                <Typography style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }} variant='h5' color='azure'>User Settings</Typography>


                <Grid item xs={12} sx={{ paddingTop: "20px", paddingLeft: '20px', backgroundColor: "#1f293a" }}>
                  <Typography color='azure' style={{ fontSize: '25px' }}>Owner</Typography>

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
                      <Typography color='azure' sx={{ paddingLeft: "10px", marginTop: '8px' }}>{owner?.firstName} {owner?.lastName}</Typography>
                    </Grid>

                  </Grid>
                </Grid>

                <Grid item xs={12} sx={{ paddingTop: "40px", paddingBottom: "20px", marginBottom: '30px', paddingLeft: '20px', backgroundColor: "#1f293a" }}>

                  {collaborators.length === 0 ?
                    <Typography color='azure' style={{ fontSize: '25px', paddingBottom: '10px' }}>No Collaborators</Typography>
                    :
                    <>
                      <Typography color='azure' style={{ fontSize: '25px', paddingBottom: '10px' }}>Collaborators</Typography>

                      {collaborators.map((collabUser) => (

                        <UserModalItem
                          owner={project.ownerId === auth?.user._id ? true : false}
                          user={collabUser}
                          removeCollaborator={removeCollaborator}
                        ></UserModalItem>
                      ))}
                    </>
                  }


                  {
                    project.ownerId === auth?.user._id ?
                      <Autocomplete
                        className='map-editor-add-collaborators'
                        open={openAutocomplete}
                        onInputChange={(_, value) => setOpenAutocomplete(value.trim().length > 0)}
                        onClose={() => setOpenAutocomplete(false)}
                        freeSolo
                        options={users?.map(user => user.userName)}
                        renderInput={(params) => <TextField {...params} label='Add Collaborator' variant='filled' />}
                        sx={{ width: '90%', borderRadius: "10px", marginTop: "20px" }}
                        onChange={handleAddCollaborator}
                      />
                      :
                      <></>
                  }

                </Grid>


              </Stack>
            </Box>
          </Box>
        )}
        {value === 2 && (
          <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center">

            <Box className='properties_container'>
              <Stack direction='column' textAlign='center'>
                <Grid container style={{ backgroundColor: "#1f293a", height: '50px' }}>
                  <Grid item xs={10}>
                    <Typography color='azure' style={{ textAlign: 'center', marginTop: '5px', fontSize: '25px' }} >Properties</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button style={{ minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px', marginTop: '10px', paddingRight: '50px' }}>
                      <Edit/>
                    </Button>
                  </Grid>
                </Grid>
                <Grid container textAlign='left' style={{ height: '200px', width: '100%', padding: '5px' }}>
                  <Grid item xs={3}>
                    <Typography style={{ overflowWrap: "break-word", marginTop: '10px', marginLeft: '10px', fontSize: '15px' }} color='azure'>Title: </Typography>
                  </Grid>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography style={{ overflowWrap: "break-word", fontSize: '15px', marginTop: '10px'}} color='azure'>{project.title}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography style={{ overflowWrap: "break-word", marginLeft: '10px', fontSize: '15px' }} color='azure'>Desc: </Typography>
                  </Grid>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography style={{ overflowWrap: "break-word", fontSize: '15px' }} color='azure'>{project.mapDescription}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography style={{ overflowWrap: "break-word", marginLeft: '10px', fontSize: '15px' }} color='azure'>Size: </Typography>
                  </Grid>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography style={{ overflowWrap: "break-word", fontSize: '15px' }} color='azure'>{project.mapHeight} x {project.mapWidth}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography style={{ overflowWrap: "break-word", marginLeft: '10px', fontSize: '15px' }} color='azure'>Tags: </Typography>
                  </Grid>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography style={{ overflowWrap: "break-word", fontSize: '15px' }} color='azure'>{project.tags.join(', ')}</Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Box>


            <Box>
              <Button onClick={handleOpenExportMap} sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: '#2dd4cf' }}>
                <Typography>Export Map</Typography>
                <IosShare style={{ marginLeft: '15px' }} />
              </Button>
            </Box>

            <Box>
              {project.ownerId == auth.user?._id ?
                project.isPublic ?
                  <Button
                    onClick={handleUnpublishMap}
                    sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: '#2dd4cf' }}>
                    <Typography>Unpublish Map</Typography>
                    <PublicIcon sx={{ color: 'black' }} style={{ marginLeft: '15px' }} />
                  </Button>
                  : <Button
                    onClick={handlePublishMap}
                    sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: '#2dd4cf' }}>
                    <Typography>Publish Map</Typography>
                    <PublicIcon style={{ marginLeft: '15px' }} />
                  </Button>
                : <></>
              }
            </Box>

            <Box>
              {project.ownerId == auth.user?._id ?
                <Button
                  onClick={handleDeleteMap}
                  sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: 'red' }}>
                  <Typography>Delete Map</Typography>
                  <DeleteIcon sx={{ color: 'black' }} style={{ marginLeft: '15px' }} />
                </Button>
                : <></>
              }
            </Box>

          </Box>
        )}
      </Box>



      <Modal
        open={openImportTileset}
        onClose={handleCloseImportTileset}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='50%' height='fit-content' top='15%' left='20%'>
          <Grid container>
            <Grid item xs={12}>
              <Typography style={{ textAlign: 'center', marginBottom: '30px' }} variant='h3' color='azure'>Import Tileset</Typography>
            </Grid>


            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }} item xs={12}>
              <input
                style={{ display: 'none' }}
                ref={inputRef}
                type="file"
                accept="image/png" 
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
              <TextField id="ts_tile_height_input" value={project.tileHeight} size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
                sx={{ "& .MuiInputBase-root": { height: 40, width: 70 } }} disabled />
            </Grid>
            <Grid style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} item xs={3}>
              <Typography style={{ fontSize: '20px', textAlign: 'center', marginRight: '12px' }} color='azure'>Tile Width:</Typography>
              <TextField id="ts_tile_width_input" value={project.tileWidth} size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
                sx={{ "& .MuiInputBase-root": { height: 40, width: 70 } }} disabled />
            </Grid>
            <Grid item xs={2}></Grid>

            <Grid item xs={12}>
              <Box sx={{ marginTop: '40px', marginLeft: '70px', width: '80%', borderRadius: '10px', backgroundColor: 'rgb(30, 30, 30)', overflow: 'scroll', height: '250px' }}>
                <Typography variant='h5' sx={{ fontStyle: 'italic', color: 'white', marginLeft: '20px', marginTop: '15px', marginBottom: '20px' }}>
                  Compatible Tilesets:
                </Typography>
                {
                  favs.tilesets && favs.tilesets.length > 0 ? favs.tilesets.map((tileset, index) => {
                    return (
                      <Box key={index} sx={{ width: '100%', marginTop: '10px', display: 'flex' }}>
                        <Typography variant='h5' sx={{ color: 'white', marginLeft: '20px', width: '30%', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex' }}>
                          {tileset.title}
                        </Typography>
                        <Typography variant='h6' sx={{ color: 'white', width: '60%', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex' }}>
                          {tileset.description ? tileset.description : 'No Description'}
                        </Typography>
                        <Button onClick={() => handleImportTileset(tileset)} sx={{ width: '10%', display: 'flex', marginRight: '40px' }}>
                          <Typography variant='p'>
                            Import
                            </Typography>
                        </Button>
                      </Box>
                    )
                  }) : <Typography variant='h6' sx={{ color: 'white', marginLeft: '20px', marginTop: '10px', overflow: 'hidden', textOverflow: 'ellipsis', }}>
                      You don't have any compatible favorites! Get out there and start liking!
                    </Typography>
                }
              </Box>
            </Grid>

            <Grid item xs={2}></Grid>
            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }} item xs={4}>
              <Button sx={{ fontSize: '20px' }} onClick={handleCloseImportTileset}>
                Close
              </Button>
            </Grid>
            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }} item xs={4}>
              <Button sx={{ fontSize: '20px' }} onClick={() => { handleImportImageTileset(); }}>
                Confirm
              </Button>
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>
        </Box>
      </Modal>


      <Modal
        open={openExportMap}
        onClose={handleCloseExportMap}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
          <Stack direction='column'>
            <Typography variant='h5' color='azure'>Export Map</Typography>
            <TextField size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20 } }} />
            <Stack direction='row'>
              <Button onClick={handleCloseExportMap}>
                <Typography >Confirm</Typography>
                <Check />
              </Button>
              <Button onClick={handleCloseExportMap}>
                <Typography>Cancel</Typography>
                <Clear />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={openPublishMap}
        onClose={handleClosePublishMap}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
          <Stack direction='column'>
            <Typography variant='h3' color='azure'>Publish Map</Typography>
            <Stack direction='row'>
              <Button onClick={publishMap}>
                <Typography >Confirm</Typography>
                <Check />
              </Button>
              <Button onClick={handleClosePublishMap}>
                <Typography>Cancel</Typography>
                <Clear />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>


      <Modal
        open={openUnpublishMap}
        onClose={handleCloseUnpublishMap}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
          <Stack direction='column'>
            <Typography variant='h3' color='azure'>Unpublish Map</Typography>
            <Stack direction='row'>
              <Button onClick={unpublishMap}>
                <Typography >Confirm</Typography>
                <Check />
              </Button>
              <Button onClick={handleCloseUnpublishMap}>
                <Typography>Cancel</Typography>
                <Clear />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>




      <Modal
        open={openDeleteMap}
        onClose={handleCloseDeleteMap}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
          <Stack direction='column'>
            <Typography variant='h3' color='azure'>Delete Map</Typography>
            <Typography variant='h5' color='azure'>Map will be permanently deleted. Are you sure?</Typography>
            <Stack direction='row'>
              <Button onClick={deleteMap}>
                <Typography >Confirm</Typography>
                <Check />
              </Button>
              <Button onClick={handleCloseDeleteMap}>
                <Typography>Cancel</Typography>
                <Clear />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>


    </Box>
  )
}

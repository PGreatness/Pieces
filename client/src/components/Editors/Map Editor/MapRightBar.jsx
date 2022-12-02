import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { Box, Stack } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Modal, Slider, TextField, Tab, Tabs, FormControl, MenuItem, InputLabel, Select, Typography, TabIndicatorProps, List, ListItem, Grid, Button } from '@mui/material'
import { Brush, HighlightAlt, OpenWith, Map, AccountCircle, People, Colorize, Edit, IosShare, Clear, AddBox, LibraryAdd, Check, Add } from '@mui/icons-material'
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
    }
    setValue(newValue);
  }

  const StyledTab = styled(Tab)({
    "&.Mui-selected": {
      color: "#2dd4cf"
    }
  });


  const handleOpenImportMap = async () => {
    await store.loadFavorites(auth.user._id, project._id);
    console.log(store);
    setOpenImportMap(true)
  }

  const handleCloseImportMap = () => {
    setOpenImportMap(false)
  }

  const handleOpenExportMap = () => {
    setOpenExportMap(true)
  }

  const handleCloseExportMap = () => {
    setOpenExportMap(false)
  }

  const handleOpenImportTileset = () => {
    setOpenImportTileset(true)
  }

  const handleCloseImportTileset = () => {
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
    //console.log(idk)
    //console.log(store.currentProject)
    //setProject(idk);
    console.log(project)
    // auth.getOwnerAndCollabs(project.ownerId, project.collaboratorIds, (owner, collabs) => {
    //   setOwner(owner);
    //   setCollaborators(collabs);
    //   setOpenUserSettings(true);
    // })
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
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%' id="importTilesetModal">
          <Stack direction='column'>
            <Typography variant='h5' color='azure'>Import Tileset</Typography>
            <TextField size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20 } }} />
            <Stack direction='row'>
              <Button onClick={handleCloseImportTileset}>
                <Typography >Confirm</Typography>
                <Check />
              </Button>
              <Button onClick={handleCloseImportTileset}>
                <Typography>Cancel</Typography>
                <Clear />
              </Button>
            </Stack>
          </Stack>
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

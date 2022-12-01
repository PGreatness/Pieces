import React from 'react'
import { useState, useContext, useEffect } from 'react';
import { Box, Stack } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Modal, Slider, TextField, Tab, Tabs, FormControl, MenuItem, InputLabel, Select, Typography, TabIndicatorProps, List, ListItem, Grid, Button } from '@mui/material'
import { Brush, HighlightAlt, OpenWith, Map, AccountCircle, People, Colorize, Edit, IosShare, Clear, AddBox, LibraryAdd, Check, Add } from '@mui/icons-material'
import PublicIcon from '@mui/icons-material/Public';
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
import {useNavigate} from 'react-router-dom';
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
  const [openUserSettings, setOpenUserSettings] = useState(false);
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
    auth.getOwnerAndCollabs(project.ownerId, project.collaboratorIds, (owner, collabs) => {
      setOwner(owner);
      setCollaborators(collabs);
    })

  }, [store.currentProject])

  useEffect(() => {
    setFavs(store.userFavs)
  }, [store.userFavs])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const StyledTab = styled(Tab)({
    "&.Mui-selected": {
      color: "#2dd4cf"
    }
  });

  useEffect(() => {
    setProject(store.currentProject);
    auth.getOwnerAndCollabs(store.currentProject.ownerId, store.currentProject.collaboratorIds, (owner, collab) => {
      setOwner(owner);
      setCollaborators(collab);
    })
  }, [store.currentProject])

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
    auth.getOwnerAndCollabs(project.ownerId, project.collaboratorIds, (owner, collabs) => {
      setOwner(owner);
      setCollaborators(collabs);
      setOpenUserSettings(true);
    })

    const users = await auth.getAllUsers();
    setUsers(users)
    console.log(users)
  }

  const handleCloseUserSettings = async function () {
    setCollaborators([])
    setOpenUserSettings(false)
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
              sx={{marginTop: '10px', marginLeft: '15px', marginRight: '15px'}}>Map: {store.currentProject.title}</Typography>

            <Box bgcolor="#ffffff" className="previewWindow" sx={{marginTop: '30px', marginBottom: '30px'}}>
              <Stack direction='column' textAlign='center'>
                <Typography bgcolor="#1f293a" color='azure'>Preview</Typography>
                <Grid container direction='row' rowSpacing={0} columns={store.currentProject.mapWidth} bgcolor='#000000' style={{ height: `250px`, width: `250px`}}>
                  {store.currentMapTiles.length > 0 && store.currentMapTiles.map((tile, index) => (
                      <MapTile index={index}/>
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
          <Box display="flex" flexDirection='column' alignItems="center" justifyContent="start" height='100%' >



            <Box className='conferenceContainer'>
              <Stack direction='column' textAlign='center' style={{ height: '225px' }}>
                <Typography bgcolor="#1f293a" color='azure'> Conference </Typography>
                <List disablePadding style={{ maxHeight: '100%', overflow: 'auto' }}>
                  <ListItem className='conference_message' style={{ backgroundColor: 'azure', borderRadius: '2px', padding: '2px', margin: '5px 0px 5px 0px' }}>
                    <Typography style={{ marginRight: '5px' }} size='10px' color='black'> Iman:  </Typography>
                    <Typography size='10px' color='black'> Hey guys! </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{ backgroundColor: 'azure', borderRadius: '2px', padding: '2px', margin: '5px 0px 5px 0px' }}>
                    <Typography style={{ marginRight: '5px' }} size='10px' color='black'> Ahnaf:  </Typography>
                    <Typography size='10px' color='black'> How's it going </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{ backgroundColor: 'antiquewhite', borderRadius: '2px', padding: '2px', margin: '5px 0px 5px 0px' }}>
                    <Typography style={{ marginRight: '5px' }} size='10px' color='black'> Me:  </Typography>
                    <Typography size='10px' color='black'> Working on maps </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{ backgroundColor: 'azure', borderRadius: '2px', padding: '2px', margin: '5px 0px 5px 0px' }}>
                    <Typography style={{ marginRight: '5px' }} size='10px' color='black'> Vincent:  </Typography>
                    <Typography size='10px' color='black'> Pretty good! </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{ backgroundColor: 'azure', borderRadius: '2px', padding: '2px', margin: '5px 0px 5px 0px' }}>
                    <Typography style={{ marginRight: '5px' }} size='10px' color='black'> Iman:  </Typography>
                    <Typography size='10px' color='black'> Cool! I'm deploying it rn </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{ backgroundColor: 'azure', borderRadius: '2px', padding: '2px', margin: '5px 0px 5px 0px' }}>
                    <Typography style={{ marginRight: '5px' }} size='10px' color='black'> Ahnaf:  </Typography>
                    <Typography size='10px' color='black'> Lmk if you guys need help </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{ backgroundColor: 'antiquewhite', borderRadius: '2px', padding: '2px', margin: '5px 0px 5px 0px' }}>
                    <Typography style={{ marginRight: '5px' }} size='10px' color='black'> Me:  </Typography>
                    <Typography size='10px' color='black'> Yep </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{ backgroundColor: 'azure', borderRadius: '2px', padding: '2px', margin: '5px 0px 5px 0px' }}>
                    <Typography style={{ marginRight: '5px' }} size='10px' color='black'> Vincent:  </Typography>
                    <Typography size='10px' color='black'> Sounds good </Typography>
                  </ListItem>
                </List>
                <Box justifyContent='right' style={{ backgroundColor: '#1f293a' }}>
                  <Grid container>
                    <Grid item xs={10}>
                      <TextField size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20 } }} />
                    </Grid>
                    <Grid item xs={2}>
                      <Button style={{ minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px' }}>
                        <Add />
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Button onClick={handleOpenUserSettings} sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: '#2dd4cf' }}>
                <Typography>Users Settings</Typography>
                <People style={{ marginLeft: '15px' }} />
              </Button>
            </Box>

          </Box>
        )}
        {value === 2 && (
          <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center">

            <Box className='properties_container'>
              <Stack direction='column' textAlign='center' style={{ height: '225px' }}>
                <Grid container style={{ backgroundColor: "#1f293a", height: '30px' }}>
                  <Grid item xs={10}>
                    <Typography color='azure'>Properties</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button style={{ minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px' }}>
                      <Edit />
                    </Button>
                  </Grid>
                </Grid>
                <Grid container textAlign='left' style={{ height: '195px', width: '100%', padding: '5px' }}>
                  <Grid item xs={3}>
                    <Typography style={{ overflowWrap: "break-word" }} color='azure'>Name: </Typography>
                  </Grid>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography style={{ overflowWrap: "break-word" }} color='azure'>Simple Grassy Plains Map </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography style={{ overflowWrap: "break-word" }} color='azure'>Desc: </Typography>
                  </Grid>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography style={{ overflowWrap: "break-word" }} color='azure'>An orthogonal 2D map that resembles a grassy plain. </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography style={{ overflowWrap: "break-word" }} color='azure'>Size: </Typography>
                  </Grid>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography style={{ overflowWrap: "break-word" }} color='azure'>64 x 64 </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography style={{ overflowWrap: "break-word" }} color='azure'>Tags: </Typography>
                  </Grid>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography style={{ overflowWrap: "break-word" }} color='azure'>Grassy, Plains, Pixel </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Box>

            <Box>
              <Button onClick={handleOpenImportMap} sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: '#2dd4cf' }}>
                <Typography>Import Map</Typography>
                <Map style={{ marginLeft: '15px' }} />
              </Button>
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
        open={openImportMap}
        onClose={handleCloseImportMap}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%' id="importTilesetModal">
          <Stack direction='column'>
            <Typography variant='h5' color='azure'>Import Map</Typography>
            <Box display="flex" alignContent="space-evenly" alignItems="end">
              <Typography color='azure' sx={{ width: 'fit-content', display: 'flex', paddingRight: '5px' }}>Import a map from a file: </Typography>
              <Button variant="contained" sx={{ color: 'black', backgroundColor: '#2dd4cf', minWidth: 'fit-content', height: '2em' }}>
                <Typography variant='p'>Browse</Typography>
                <FolderOpenIcon style={{ marginLeft: '5px', width: '1em' }} />
              </Button>
            </Box>
            <Box>
              {
                favs.tilesets.map((tilesets) => (
                  <h1>{tilesets.title}</h1>
                ))
              }
            </Box>
            <TextField size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20 } }} />
            <Stack direction='row'>
              <Button onClick={handleCloseImportMap}>
                <Typography >Confirm</Typography>
                <Check />
              </Button>
              <Button onClick={handleCloseImportMap}>
                <Typography>Cancel</Typography>
                <Clear />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

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



      <Modal
        open={openUserSettings}
        onClose={handleCloseUserSettings}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='25%' top='30%' left='30%'>
          <Stack direction='column'>
            <Typography style={{ textAlign: 'center', marginBottom: '5px' }} variant='h5' color='azure'>User Settings</Typography>


            <Grid justify='center' container style={{ backgroundColor: "#1f293a" }}>
              <Grid item xs={1}>
                <AccountCircle />
              </Grid>
              <Grid item xs={6}>
                <Typography color='azure'>{owner?.firstName} {owner?.lastName}</Typography>
              </Grid>
              <Grid align='center' item xs={5}>
                <Typography color='azure'>Owner</Typography>
              </Grid>
            </Grid>

            {collaborators.length === 0 ?
              <Grid item xs={12}>
                <Typography color='azure'>No Collaborators</Typography>
              </Grid> :
              collaborators.map((collabUser) => (
                <UserModalItem
                  owner={project.ownerId === auth?.user._id ? true : false}
                  user={collabUser}
                  removeCollaborator={removeCollaborator}
                ></UserModalItem>
              ))
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
                  onChange={handleAddCollaborator}
                />
                :
                <></>
            }




            <Button onClick={handleCloseUserSettings}>
              <Typography>Cancel</Typography>
              <Clear />
            </Button>
          </Stack>
        </Box>
      </Modal>

    </Box>
  )
}

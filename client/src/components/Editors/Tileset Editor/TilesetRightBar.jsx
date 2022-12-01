import React, { useEffect } from 'react'
import { Box, Stack } from '@mui/system';
import { Modal, TextField, Tab, Tabs, FormControl, MenuItem, InputLabel, Select, Typography, List, ListItem, Grid, Button } from '@mui/material'
import { PersonRemove, AccountCircle, People, Edit, IosShare, Clear, AddBox, LibraryAdd, Check, Add, Visibility } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete';
import PublicIcon from '@mui/icons-material/Public';
import { styled } from "@mui/material/styles";
import { useState, useContext } from 'react';
import { GlobalStoreContext } from '../../../store/store'
import AuthContext from '../../../auth/auth'
import { useNavigate } from 'react-router-dom';
import UserModalItem from '../Map Editor/UserModalItem';
import Autocomplete from '@mui/material/Autocomplete';
import html2canvas from "html2canvas";


export default function TilesetRightBar(props) {

  const { store } = useContext(GlobalStoreContext)
  const { auth } = useContext(AuthContext)

  const [value, setValue] = useState(0);
  const [openImportTileset, setOpenImportTileset] = useState(false);
  const [openImportTile, setOpenImportTile] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);
  const [openUnpublish, setOpenUnpublish] = useState(false);
  const [openExportTileset, setOpenExportTileset] = useState(false);
  const [openUserSettings, setOpenUserSettings] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTile, setCurrentTile] = useState(store.currentTile)
  const [openDeleteTileset, setOpenDeleteTileset] = useState(false)
  const [project, setProject] = useState(store.currentProject)
  const [owner, setOwner] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [users, setUsers] = useState([]);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);

  const navigate = useNavigate();
  var ndarray = require("ndarray")
  var zeros = require("zeros")

  useEffect(() => {
    setCurrentTile(store.currentTile)
  }, [store.currentTile])

  // useEffect(() => {
  //   setProject(store.currentProject)
  // }, [store.currentProject])

  useEffect(() => {
    console.log(store.currentProject)
    setProject(store.currentProject)
    auth.getOwnerAndCollaborators(project._id, false).then((data) => {
      console.log(data)
      setOwner(data.owner)
      setCollaborators(data.collaborators)
    })
  }, [store.currentProject])

  //let pixels = []
  // var savePixels = require("save-pixels")

  // useEffect(() => {
  //   if (store.currentTile) {
  //     tileData = store.currentTile.tileData
  //     console.log("Save Pixels Debugs")
  //     console.log(store.currentTile)
  //     let height = store.currentTile.height

  //     // let pixels = ndarray(new Array(tileData), [height, height])
  //     let prev = document.getElementById('tileset-canvas-grid')
  //     prev.style.height = '100%'
  //     prev.style.width = '100%' 
  //     setPreview(prev)

  //     let previewWindow = document.getElementById('preview-window')
  //     previewWindow.appendChild(preview)

  //   }
  // }, [store.currentTile])

  if (store.currentTile) {
    console.log("Store tile data")
    console.log(store.currentTile.tileData)
  }

  const startEditing = () => {
    setEditMode(true)
  }

  const endEditing = () => {
    setEditMode(false)
  }

  const handleUpdateProperties = () => {
    let payload = {
      title: document.getElementById('title_input').value,
      tilesetDesc: document.getElementById('desc_input').value,
      tilesetTags: document.getElementById('tags_input').value
    }
    store.updateTilesetProperties(store.currentProject._id, store.currentProject.ownerId, payload)
    setEditMode(false)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const StyledTab = styled(Tab)({
    "&.Mui-selected": {
      color: "#2dd4cf"
    }
  });

  const handleOpenImportTileset = () => {
    setOpenImportTileset(true)
  }

  const handleCloseImportTileset = () => {
    setOpenImportTileset(false)
  }

  const handleOpenImportTile = () => {
    setOpenImportTile(true)
  }

  const handleCloseImportTile = () => {
    setOpenImportTile(false)
  }

  const handleOpenExportTileset = () => {
    setOpenExportTileset(true)
  }

  const handleCloseExportTileset = () => {
    setOpenExportTileset(false)
  }



  const handleOpenUserSettings = async function () {
    const data = await auth.getOwnerAndCollaborators(project._id, false);
    setOwner(data.owner);
    setCollaborators(data.collaborators);
    setOpenUserSettings(true);

    const users = await auth.getAllUsers();
    setUsers(users)
    console.log(users)
  }

  const handleCloseUserSettings = async function () {
    setCollaborators([])
    setOpenUserSettings(false)
  }

  const handlePublish = () => {
    setOpenPublish(true)
  }

  const handleClosePublish = () => {
    setOpenPublish(false)
  }

  const publish = () => {
    store.publishTileset();
    handleClosePublish();
  }

  const handleUnpublish = () => {
    setOpenUnpublish(true)
  }

  const handleCloseUnpublish = () => {
    setOpenUnpublish(false)
  }

  const unpublish = () => {
    store.unpublishTileset();
    handleCloseUnpublish();
  }

  const handleDeleteTileset = () => {
    setOpenDeleteTileset(true)
  }

  const handleCloseDeleteTileset = () => {
    setOpenDeleteTileset(false)
  }

  const deleteTileset = () => {
    handleCloseDeleteTileset();
    store.deleteTileset(project._id);
    props.setLoc('/library');
    navigate('/library');
  }


  const handleAddCollaborator = async (e, value, reason) => {
    if (reason === 'selectOption') {
      await auth.getUserByUsername(value, (user) => {
        store.addTilesetCollaborator(project._id, user._id)
          .then(() => console.log(store))
          .catch((err) => console.log(err))
      })
    }
  }

  const removeCollaborator = async function (id) {
    console.log("in remove collab tileset")
    let newTileset = await store.removeTilesetCollaborator(project._id, id);
    console.log(project)
    // auth.getOwnerAndCollabs(project.ownerId, project.collaboratorIds, (owner, collabs) => {
    //   setOwner(owner);
    //   setCollaborators(collabs);
    //   setOpenUserSettings(true);
    // })
  }


  return (
    <Box bgcolor={"#11182a"} flex={4} className="tile_rightbar">
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
      <Box sx={{ padding: 2 }}>
        {value === 0 && (
          <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center">

            <Typography color='azure' variant='h4' 
              sx={{marginTop: '10px', marginLeft: '30px', marginRight: '15px'}}>Tileset: {store.currentProject.title}</Typography>

            <Box bgcolor="#ffffff" className="previewWindow" sx={{marginTop: '30px', marginBottom: '30px'}}>
              <Stack id='preview-window' direction='column' textAlign='center'>
                <Typography bgcolor="#1f293a" color='azure'>Preview</Typography>
                {currentTile
                  ? (<Grid container direction='row' rowSpacing={0} style={{ height: '250px', width: '250px' }} columns={currentTile.width} bgcolor='#000000'>
                    {currentTile.tileData.map((pixel, index) => (
                      pixel === ''
                        ? <Grid item xs={1} style={{ height: `calc(100% / ${currentTile.width}` }} bgcolor='#fff'></Grid>
                        : <Grid item xs={1} style={{ height: `calc(100% / ${currentTile.width}` }} bgcolor={pixel}></Grid>
                    ))}
                  </Grid>)
                  : <div></div>
                }
              </Stack>
            </Box>

            <Box>
              <Button onClick={handleOpenImportTile} sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: '#2dd4cf' }}>
                <Typography>Import Tile</Typography>
                <AddBox style={{ marginLeft: '8px' }} />
              </Button>
            </Box>
            <Box>
              <Button onClick={handleOpenImportTileset} sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: '#2dd4cf' }}>
                <Typography>Import Tileset</Typography>
                <LibraryAdd style={{ marginLeft: '8px' }} />
              </Button>
            </Box>
          </Box>
        )}
        {value === 1 && (
          <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center">


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
                    <Typography size='10px' color='black'> Working on tiles </Typography>
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
                <Typography>User Settings</Typography>
                <People />
              </Button>
            </Box>

          </Box>
        )}
        {value === 2 && (
          <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center">

            <Box className='properties_container'>
              <Stack direction='column' textAlign='center' style={{ height: '225px' }}>
                {!editMode
                  ? <Grid container style={{ backgroundColor: "#1f293a", height: '30px' }}>
                    <Grid item xs={10}>
                      <Typography color='azure'>Properties</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Button onClick={startEditing} style={{ minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px' }}>
                        <Edit />
                      </Button>
                    </Grid>
                  </Grid>
                  : <Grid container style={{ backgroundColor: "#1f293a", height: '30px' }}>
                    <Grid item xs={8}>
                      <Typography color='azure'>Properties</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Button onClick={handleUpdateProperties} style={{ minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px' }}>
                        <Check />
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button onClick={endEditing} style={{ minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px' }}>
                        <Clear />
                      </Button>
                    </Grid>
                  </Grid>
                }
                {!editMode
                  ? <Grid container textAlign='left' style={{ height: '195px', width: '100%', padding: '5px' }}>
                    <Grid item xs={3}>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>Name: </Typography>
                    </Grid>
                    <Grid item xs={9} zeroMinWidth>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>{store.currentProject.title}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>Desc: </Typography>
                    </Grid>
                    <Grid item xs={9} zeroMinWidth>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>{store.currentProject.tilesetDesc}</Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>Tile Size: </Typography>
                    </Grid>
                    <Grid item xs={7} zeroMinWidth>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>{store.currentProject.tileHeight + " x " + store.currentProject.tileWidth}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>Tags: </Typography>
                    </Grid>
                    <Grid item xs={9} zeroMinWidth>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>{store.currentProject.tilesetTags}</Typography>
                    </Grid>
                  </Grid>
                  : <Grid container textAlign='left' style={{ height: '195px', width: '100%', padding: '5px' }}>
                    <Grid item xs={3}>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>Name: </Typography>
                    </Grid>
                    <Grid item xs={9} zeroMinWidth>
                      <TextField id='title_input' defaultValue={store.currentProject.title} size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20 } }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>Desc: </Typography>
                    </Grid>
                    <Grid item xs={9} zeroMinWidth>
                      <TextField id='desc_input' defaultValue={store.currentProject.tilesetDesc} size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20 } }} />
                    </Grid>
                    <Grid item xs={5}>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>Tile Size: </Typography>
                    </Grid>
                    <Grid item xs={7} zeroMinWidth>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>{store.currentProject.tileHeight + " x " + store.currentProject.tileWidth}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>Tags: </Typography>
                    </Grid>
                    <Grid item xs={9} zeroMinWidth>
                      <TextField id='tags_input' defaultValue={store.currentProject.tilesetTags} size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20 } }} />
                    </Grid>
                  </Grid>
                }

              </Stack>
            </Box>

            <Box>
              <Button onClick={handleOpenExportTileset} sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: '#2dd4cf' }}>
                <Typography>Export Tileset</Typography>
                <IosShare style={{ marginLeft: '8px' }} />
              </Button>
            </Box>

            <Box>
              {project.ownerId == auth.user?._id ?
                project.isPublic ?
                  <Button
                    onClick={handleUnpublish}
                    sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: '#2dd4cf' }}>
                    <Typography>Unpublish Tileset</Typography>
                    <PublicIcon sx={{ color: 'black' }} style={{ marginLeft: '15px' }} />
                  </Button>
                  : <Button
                    onClick={handlePublish}
                    sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: '#2dd4cf' }}>
                    <Typography>Publish Tileset</Typography>
                    <PublicIcon style={{ marginLeft: '15px' }} />
                  </Button>
                : <></>
              }
            </Box>

            <Box>
              {project.ownerId == auth.user?._id ?
                <Button
                  onClick={handleDeleteTileset}
                  sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: 'red' }}>
                  <Typography>Delete Tileset</Typography>
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
        open={openImportTile}
        onClose={handleCloseImportTile}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
          <Stack direction='column'>
            <Typography variant='h5' color='azure'>Import Tile</Typography>
            <TextField size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20 } }} />
            <Stack direction='row'>
              <Button onClick={handleCloseImportTile}>
                <Typography >Confirm</Typography>
                <Check />
              </Button>
              <Button onClick={handleCloseImportTile}>
                <Typography>Cancel</Typography>
                <Clear />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={openExportTileset}
        onClose={handleCloseExportTileset}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
          <Stack direction='column'>
            <Typography variant='h5' color='azure'>Export Tileset</Typography>
            <TextField size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', "& .MuiInputBase-root": { height: 20 } }} />
            <Stack direction='row'>
              <Button onClick={handleCloseExportTileset}>
                <Typography >Confirm</Typography>
                <Check />
              </Button>
              <Button onClick={handleCloseExportTileset}>
                <Typography>Cancel</Typography>
                <Clear />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={openDeleteTileset}
        onClose={handleCloseDeleteTileset}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
          <Stack direction='column'>
            <Typography variant='h3' color='azure'>Delete Tileset</Typography>
            <Typography variant='h5' color='azure'>Tileset will be permanently deleted. Are you sure?</Typography>
            <Stack direction='row'>
              <Button onClick={deleteTileset}>
                <Typography >Confirm</Typography>
                <Check />
              </Button>
              <Button onClick={handleCloseDeleteTileset}>
                <Typography>Cancel</Typography>
                <Clear />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={openPublish}
        onClose={handleClosePublish}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
          <Stack direction='column'>
            <Typography variant='h3' color='azure'>Publish Tileset</Typography>
            <Stack direction='row'>
              <Button onClick={publish}>
                <Typography >Confirm</Typography>
                <Check />
              </Button>
              <Button onClick={handleClosePublish}>
                <Typography>Cancel</Typography>
                <Clear />
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>


      <Modal
        open={openUnpublish}
        onClose={handleCloseUnpublish}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
          <Stack direction='column'>
            <Typography variant='h3' color='azure'>Unpublish Tileset</Typography>
            <Stack direction='row'>
              <Button onClick={unpublish}>
                <Typography >Confirm</Typography>
                <Check />
              </Button>
              <Button onClick={handleCloseUnpublish}>
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
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='40%' height='40%' top='30%' left='25%'>
          <Stack direction='column'>
            <Typography style={{ textAlign: 'center', marginBottom: '20px' }} variant='h5' color='azure'>User Settings</Typography>


            <Grid justify='center' container style={{ backgroundColor: "#1f293a", height: "50px" }}>
              <Grid item xs={1}>
                <AccountCircle />
              </Grid>
              <Grid item xs={8}>
                <Typography color='azure'>{owner?.firstName} {owner?.lastName}</Typography>
              </Grid>
              <Grid align='center' item xs={3}>
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

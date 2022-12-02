import React, { useEffect, useRef } from 'react'
import { Box, Stack } from '@mui/system';
import { Modal, TextField, Tab, Tabs, FormControl, MenuItem, InputLabel, Select, Typography, List, ListItem, Grid, Button } from '@mui/material'
import { PersonRemove, AccountCircle, People, Edit, IosShare, Clear, AddBox, LibraryAdd, Check, Add, Visibility } from '@mui/icons-material'
import { Avatar } from "@mui/material";
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
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';


export default function TilesetRightBar(props) {

  const { store } = useContext(GlobalStoreContext)
  const { auth } = useContext(AuthContext)

  const [value, setValue] = useState(0);
  const [openImportTileset, setOpenImportTileset] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);
  const [openUnpublish, setOpenUnpublish] = useState(false);
  const [openExportTileset, setOpenExportTileset] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTile, setCurrentTile] = useState(store.currentTile)
  const [openDeleteTileset, setOpenDeleteTileset] = useState(false)
  const [project, setProject] = useState(store.currentProject)
  const [owner, setOwner] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [users, setUsers] = useState([]);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [image, setImage] = useState(null)
  const inputRef = useRef(null);

  const navigate = useNavigate();
  var ndarray = require("ndarray")
  var zeros = require("zeros")

  useEffect(() => {
    console.log(store)
    console.log(store.currentTile)
    setCurrentTile(store.currentTile)
  }, [store.currentTile])

  // useEffect(() => {
  //   setProject(store.currentProject)
  // }, [store.currentProject])

  useEffect(() => {
    console.log(store)
    console.log(store.currentProject)
    setProject(store.currentProject)
    auth.getOwnerAndCollaborators(project._id, false).then((data) => {
      //console.log(data)
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

  const handleOpenImportTileset = () => {
    setOpenImportTileset(true)
  }

  const handleCloseImportTileset = () => {
    setImage(null)
    setOpenImportTileset(false)
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

    const users = await auth.getAllUsers();
    setUsers(users)
    console.log(users)
  }

  const handleCloseUserSettings = async function () {
    setCollaborators([])
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

  const handleOpenFileInput = () => {
    inputRef.current.click();
  }


  const handleFileChange = async function (event) {
    let image = event.target.files[0];
    console.log(image)
    setImage(image.name)
  };


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
              sx={{ marginTop: '10px', marginLeft: '30px', marginRight: '15px' }}>Tileset: {store.currentProject.title}</Typography>

            <Box bgcolor="#ffffff" className="previewWindow" sx={{ marginTop: '30px', marginBottom: '30px' }}>
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
              <Button onClick={handleOpenImportTileset} sx={{ color: 'black', width: '250px', marginTop: '15px', backgroundColor: '#2dd4cf' }}>
                <Typography>Import Tileset</Typography>
                <LibraryAdd style={{ marginLeft: '8px' }} />
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
                      <Typography color='azure' sx={{paddingLeft: "10px", marginTop: '8px'}}>{owner?.firstName} {owner?.lastName}</Typography>
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
                      sx={{width: '90%', borderRadius: "10px", marginTop: "20px"}}
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
        open={openImportTileset}
        onClose={handleCloseImportTileset}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='50%' height='50%' top='30%' left='20%'>
          <Grid container>
            <Grid item xs={12}>
              <Typography style={{ textAlign: 'center', marginBottom: '50px' }} variant='h3' color='azure'>Upload Tileset</Typography>
            </Grid>


            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }} item xs={12}>
              <input
                style={{ display: 'none' }}
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
              />
              <TextField
                value={image ? image : "Import Tileset..."}
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
            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }} item xs={4}>
              <Button sx={{ fontSize: '20px' }} onClick={handleCloseImportTileset}>
                Close
                            </Button>
            </Grid>
            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }} item xs={4}>
              <Button sx={{ fontSize: '20px' }} onClick={handleCloseImportTileset}>
                Confirm
                            </Button>
            </Grid>
            <Grid item xs={2}></Grid>
          </Grid>
        </Box>
      </Modal>

    </Box>
  )
}

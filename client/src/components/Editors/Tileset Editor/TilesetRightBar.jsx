import React, { useEffect, useRef } from 'react'
import { Box, Stack } from '@mui/system';
import { Modal, TextField, Tab, Tabs, FormControl, MenuItem, InputLabel, Select, Typography, List, ListItem, Grid, Button } from '@mui/material'
import { Edit, IosShare, Clear, LibraryAdd, Check, Add, Visibility } from '@mui/icons-material'
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
  const [showError, setShowError] = useState(false)
  const [image, setImage] = useState(null)
  const [favs, setFavs] = useState([])
  const [openTagsErrorModal, setOpenTagsErrorModal] = useState(false)
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

  useEffect(() => {
    setFavs(store.userFavs)
  }, [store.userFavs])

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

  // if (store.currentTile) {
  //   console.log("Store tile data")
  //   console.log(store.currentTile.tileData)
  // }

  const startEditing = () => {
    setEditMode(true)
  }

  const endEditing = () => {
    setEditMode(false)
  }

  const handleUpdateProperties = () => {
    // if (wrong format) {
    //   modal
    //   return
    // }

    let flag = false

    let tagsText = document.getElementById('tags_input').value
    if (tagsText.includes(',') && !tagsText.includes(', ')) {
      setOpenTagsErrorModal(true)
      return
    }

    let tags = tagsText.split(", ")
    for (let i = 0; i < tags.length; i++) {
      if (tags[i] === '') {
        setOpenTagsErrorModal(true)
        return
      }
    }

    // if (flag) return

    console.log("new tags: ")
    console.log(tags)
    let payload = {
      title: document.getElementById('title_input').value,
      tilesetDesc: document.getElementById('desc_input').value,
      tilesetTags: tags
    }
    store.updateTilesetProperties(payload)
    setEditMode(false)
  }

  const handleCloseTagsErrorModal = () => {
    setOpenTagsErrorModal(false)
  }

  const handleChange = (event, newValue) => {
    if (newValue === 1) {
      handleOpenUserSettings()
    } else {
      handleCloseUserSettings();
    }
    setValue(newValue);
  }

  const handleOpenImportTileset = async () => {
    await store.loadFavorites(auth.user._id, project._id)
    setOpenImportTileset(true)
  }

  const handleCloseImportTileset = () => {
    setImage(null)
    setShowError(false)
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
    setImage(image)
  };

  const handleImportTileset = async function (tileset) {
    console.log(tileset)
    await store.importTilesetToTileset(tileset._id)
    handleCloseImportTileset()
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

      var context = document.getElementById('canvas').getContext('2d');
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


        // WHERE IS RESPONSE COMING FROM?????
        await store.loadTileset(store.currentProject._id)
        // console.log(store)


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

        console.log("TILES")
        console.log(tiles)
        // console.log(title)
        console.log(tilesetHeight)
        console.log(tileHeight)
        console.log(ownerId)

        // Create new tileset
        // let response = await store.createNewTileset(title, tilesetHeight, tilesetWidth, tileHeight, tileWidth, ownerId)

        // Create new tiles to go into tileset
        for (let i = 0; i < tiles.length; i++) {
          let createTileResponse = await store.createTile(store.currentProject._id, store.currentProject.tileHeight, store.currentProject.tileWidth, tiles[i])
          console.log(createTileResponse)
        }
        await store.setCurrentTileset(project._id);
        handleCloseImportTileset();
      }
    }

  }



  const handleExportTileset = () => {
    console.log("exporting tileset")

    store.getTilesetTiles(store.currentProject._id).then((tiles) => {
      console.log(tiles)

      // if tile data = '' then put rgba a equal to 0
      let tiles1 = tiles[0].tileData
      let rgba = []

      tiles.forEach((tileObj) => {
        let tileData = tileObj.tileData

        tileData.forEach((tile) => {
          console.log(tile)
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

      })

      console.log(rgba)
      let numTiles = tiles.length
      var rgbaArray = new ImageData(new Uint8ClampedArray(rgba), store.currentProject.tileWidth, store.currentProject.tileHeight*numTiles);
      console.log(rgbaArray)

      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.height = store.currentProject.tileHeight*numTiles
      canvas.width = store.currentProject.tileWidth

      context.putImageData(rgbaArray, 0, 0);

      var img = new Image();
      img.src = canvas.toDataURL();

      var link = document.createElement('a');
      link.download = store.currentProject.title + '_' + store.currentProject.tileHeight + 'x' + store.currentProject.tileWidth;
      link.href = canvas.toDataURL();
      link.click();

      canvas.remove();
      link.remove();

    })




    setOpenExportTileset(false)
  }




  const StyledTab = styled(Tab)({
    "&.Mui-selected": {
      color: "#2dd4cf"
    }
  });


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
                {!editMode
                  ? <Grid container style={{ backgroundColor: "#1f293a", height: '50px' }}>
                    <Grid item xs={10}>
                      <Typography color='azure' style={{ textAlign: 'center', marginTop: '5px', fontSize: '25px' }} >Properties</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Button onClick={startEditing} style={{ minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px', marginTop: '10px', paddingRight: '50px' }}>
                        <Edit />
                      </Button>
                    </Grid>
                  </Grid>
                  : <Grid container style={{ backgroundColor: "#1f293a", height: '50px' }}>
                    <Grid item xs={8}>
                      <Typography color='azure' style={{ textAlign: 'center', marginTop: '5px', fontSize: '25px' }} >Properties</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Button onClick={handleUpdateProperties} style={{ minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px', marginTop: '10px', paddingRight: '30px' }}>
                        <Check />
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Button onClick={endEditing} style={{ minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px', marginTop: '10px', paddingRight: '20px' }}>
                        <Clear />
                      </Button>
                    </Grid>
                  </Grid>
                }
                {!editMode
                  ? <Grid container textAlign='left' style={{ height: '200px', width: '100%', padding: '5px' }}>
                    <Grid item xs={3}>
                      <Typography style={{ overflowWrap: "break-word", marginTop: '10px', marginLeft: '10px', fontSize: '15px' }} color='azure'>Title: </Typography>
                    </Grid>
                    <Grid item xs={9} zeroMinWidth>
                      <Typography style={{ overflowWrap: "break-word", fontSize: '15px', marginTop: '10px' }} color='azure'>{store.currentProject.title}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography style={{ overflowWrap: "break-word", marginLeft: '10px', fontSize: '15px' }} color='azure'>Desc: </Typography>
                    </Grid>
                    <Grid item xs={9} zeroMinWidth>
                      <Typography style={{ overflowWrap: "break-word", fontSize: '15px' }} color='azure'>{store.currentProject.tilesetDesc}</Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography style={{ overflowWrap: "break-word", marginLeft: '10px', fontSize: '15px' }} color='azure'>Tile Size: </Typography>
                    </Grid>
                    <Grid item xs={7} zeroMinWidth>
                      <Typography style={{ overflowWrap: "break-word", fontSize: '15px' }} color='azure'>{store.currentProject.tileHeight + " x " + store.currentProject.tileWidth}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography style={{ overflowWrap: "break-word", marginLeft: '10px', fontSize: '15px' }} color='azure'>Tags: </Typography>
                    </Grid>
                    <Grid item xs={9} zeroMinWidth>
                      <Typography style={{ overflowWrap: "break-word", fontSize: '15px' }} color='azure'>{store.currentProject.tilesetTags.join(', ')}</Typography>
                    </Grid>
                  </Grid>
                  : <Grid container textAlign='left' style={{ height: '200px', width: '100%', padding: '5px' }}>
                    <Grid item xs={3}>
                      <Typography style={{ overflowWrap: "break-word", marginTop: '10px', marginLeft: '10px', fontSize: '15px' }} color='azure'>Title: </Typography>
                    </Grid>
                    <Grid item xs={9} zeroMinWidth>
                      <TextField id='title_input' defaultValue={store.currentProject.title} size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', borderRadius: '10px', "& .MuiInputBase-root": { height: 30 } }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography style={{ overflowWrap: "break-word", marginLeft: '10px', marginTop: '10px', fontSize: '15px' }} color='azure'>Desc: </Typography>
                    </Grid>
                    <Grid item xs={9} zeroMinWidth>
                      <TextField id='desc_input' defaultValue={store.currentProject.tilesetDesc} size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', borderRadius: '10px', "& .MuiInputBase-root": { height: 30 } }} />
                    </Grid>
                    <Grid item xs={5}>
                      <Typography style={{ overflowWrap: "break-word", marginLeft: '10px', marginTop: '0px', fontSize: '15px' }} color='azure'>Tile Size: </Typography>
                    </Grid>
                    <Grid item xs={7} zeroMinWidth>
                      <Typography style={{ overflowWrap: "break-word" }} color='azure'>{store.currentProject.tileHeight + " x " + store.currentProject.tileWidth}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography style={{ overflowWrap: "break-word", marginLeft: '10px', marginTop: '10px', fontSize: '15px' }} color='azure'>Tags: </Typography>
                    </Grid>
                    <Grid item xs={9} zeroMinWidth>
                      <TextField id='tags_input' defaultValue={store.currentProject.tilesetTags.join(', ')} size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', borderRadius: '10px', "& .MuiInputBase-root": { height: 30 } }} />
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
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' height='40%' width='40%' top='30%' left='30%'>
          <Stack direction='column'>
            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '50px' }} item xs={12}>
              <Typography variant='h3' style={{ textAlign: 'center', marginRight: '10px' }} color='azure'>Export Tileset</Typography>
            </Grid>

            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }} item xs={12}>
              <Typography style={{ fontSize: '25px', textAlign: 'center', marginRight: '10px' }} color='azure'>Tileset Name: {store.currentProject.title}</Typography>
            </Grid>

            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }} item xs={12}>
              <Typography style={{ fontSize: '25px', textAlign: 'center', marginRight: '10px' }} color='azure'>Num Tiles: {store.currentProject.tiles.length}</Typography>
            </Grid>

            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '40px' }} item xs={12}>
              <Typography style={{ fontSize: '25px', textAlign: 'center', marginRight: '10px' }} color='azure'>Tile Height: {store.currentProject.tileHeight}</Typography>
              <Typography style={{ fontSize: '25px', textAlign: 'center', marginRight: '10px' }} color='azure'>Tile Width: {store.currentProject.tileWidth}</Typography>
            </Grid>

            <Stack direction='row'>
              <Button onClick={handleExportTileset} sx={{ fontSize: '20px', marginLeft: '30%', marginRight: '50px' }}>
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
                  favs?.tilesets && favs?.tilesets.length > 0 ? favs?.tilesets.map((tileset, index) => {
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
          open={openTagsErrorModal}
          onClose={handleCloseTagsErrorModal}
      >
          <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
          <Stack direction='column' style={{margin:'10px'}}>
              <Typography style={{textAlign:'center', marginBottom:'10px'}} variant='h5' color='#2dd4cf'>Error</Typography>
              <Typography style={{textAlign:'center'}} color='azure'>Make sure tags are separated with ", "</Typography>
          </Stack>
          </Box>
      </Modal>

      <canvas style={{}} id='canvas'></canvas>

    </Box>
  )
}

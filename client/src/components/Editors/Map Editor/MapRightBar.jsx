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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



import './css/mapRightBar.css';

export default function MapRightBar(props) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  //console.log(store.currentProject)
  //const project = store.currentProject;

  const [project, setProject] = useState(store.currentProject);
  const [owner, setOwner] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [users, setUsers] = useState([]);
  const [value, setValue] = useState(0);

  const [openImportMap, setOpenImportMap] = useState(false);
  const [openExportMap, setOpenExportMap] = useState(false);
  const [openImportTileset, setOpenImportTileset] = useState(false);
  const [openPublishMap, setOpenPublishMap] = useState(false);
  const [openUnpublishMap, setOpenUnpublishMap] = useState(false);
  const [openDeleteMap, setOpenDeleteMap] = useState(false);
  const [favs, setFavs] = useState(store.userFavs);
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [image, setImage] = useState(null)
  const [showError, setShowError] = useState(false)
  const [tilesets, setTilesets] = useState([])
  const [openTagsErrorModal, setOpenTagsErrorModal] = useState(false)
  const inputRef = useRef(null);

  const navigate = useNavigate();
  // console.log(owner)
  // console.log(collaborators)
  // console.log(project)

  useEffect(() => {
    setProject(store.currentProject)
    auth.getOwnerAndCollaborators(project ? project._id : '', true).then((data) => {
      setOwner(data.owner);
      setCollaborators(data.collaborators);
    })
  }, [store.currentProject])

  useEffect(() => {
    store.getMapTiles(store.currentProject?._id).then((tilesetArray) => {
      setTilesets(tilesetArray)
    })
  }, [store.currentMapTiles])

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


  const startEditing = () => {
    setEditMode(true)
  }

  const endEditing = () => {
    setEditMode(false)
  }

  const handleUpdateProperties = () => {

    let tagsText = document.getElementById('tags_input').value
    if (tagsText.includes(',') && !tagsText.includes(', ')) {
      setOpenTagsErrorModal(true)
      return
    }

    let tags = tagsText
    if (tagsText.length > 0) {
      tags = tagsText.split(", ")
      for (let i = 0; i < tags.length; i++) {
        if (tags[i] === '') {
          setOpenTagsErrorModal(true)
          return
        }
      }
    }

    let payload = {
      title: document.getElementById('title_input').value,
      mapDescription: document.getElementById('desc_input').value,
      tags: tags
    }
    store.updateMapProperties(payload)
    setEditMode(false)
  }

  const handleCloseTagsErrorModal = () => {
    setOpenTagsErrorModal(false)
  }

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

  const handleImportTileset = async (tileset) => {

    // create a new tileset here with isLocked !!!!
    let isLocked = true;
    let response = await store.createNewTileset(tileset.title, tileset.imagePixelHeight, tileset.imagePixelWidth, tileset.tileHeight, tileset.tileWidth, tileset.ownerId, isLocked)

    await store.importTilesetToCopyTileset(tileset._id, response.data.tileset._id)

    store.importTilesetToMap(response.data.tileset._id);
    auth.socket.emit('updateMap', {project: project._id})
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

        let isLocked = true;

        // Create new tileset
        let response = await store.createNewTileset(image.name.slice(0, -4), tilesetHeight, tilesetWidth, tileHeight, tileWidth, ownerId, isLocked)
        let newTileset = response.data.tileset


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

          var rgbaArray = new ImageData(new Uint8ClampedArray(rgba), tileWidth, tileHeight);

          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          canvas.height = tileHeight
          canvas.width = tileWidth

          context.putImageData(rgbaArray, 0, 0);
          var imgSrc = canvas.toDataURL();
          canvas.remove();
          return imgSrc
        }


        // Create new tiles to go into tileset
        for (let i = 0; i < tiles.length; i++) {
          let imgSrc = convertToImage(tiles[i]);
          //console.log(imgSrc)
          let createTileResponse = await store.createTile(newTileset._id, tileHeight, tileWidth, tiles[i], imgSrc)
          console.log(createTileResponse)
        }


        await store.importTilesetToMap(newTileset._id);
        canvas.remove();
        handleCloseImportTileset();
      }
    }

  }

  const exportMapAsJSON = async () => {

    let tilesets = []
    let tilesetImages = []

    store.getMapTilesets(project._id).then((tilesetObjs) => {

      let currIndex = 1

      tilesetObjs.forEach((tileset) => {

        let img;

        store.getTilesetTiles(tileset._id).then((tiles) => {

          let rgba = []

          tiles.forEach((tileObj) => {
            let tileData = tileObj.tileData

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

          })

          let numTiles = tiles.length
          var rgbaArray = new ImageData(new Uint8ClampedArray(rgba), project.tileWidth, project.tileHeight * numTiles);

          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          canvas.height = project.tileHeight * numTiles
          canvas.width = project.tileWidth

          context.putImageData(rgbaArray, 0, 0);
          img = canvas.toDataURL()
          var link = document.createElement('a');
          link.download = tileset.title + '_' + tileset.tileHeight + 'x' + tileset.tileWidth;
          link.href = canvas.toDataURL();
          link.click();

          canvas.remove();
          link.remove();

        })

        console.log(img)

        let tilesetObj = {
          columns: 1,
          firstgid: currIndex,
          image: "./" + tileset.title + "_" + tileset.tileHeight + "x" + tileset.tileWidth,
          imageheight: tileset.tileHeight * tileset.tiles.length,
          imagewidth: tileset.tileWidth,
          margin: 0,
          name: tileset.title,
          spacing: 0,
          tilecount: tileset.tiles.length,
          tileheight: tileset.tileHeight,
          tilewidth: tileset.tileWidth,
        }
        currIndex += tileset.tiles.length
        tilesets.push(tilesetObj)
        console.log(tilesets)
      })

      let mapJSON =
      {
        "height": project.mapHeight,
        "layers": [
          {
            "data": store.currentMapTiles.map(x => x + 1),
            "height": project.mapHeight,
            "name": project.title,
            "opacity": 1,
            "type": "tilelayer",
            "visible": true,
            "width": project.mapWidth,
            "x": 0,
            "y": 0
          }],
        "nextobjectid": 1,
        "orientation": "orthogonal",
        "renderorder": "right-down",
        "tiledversion": "1.0.3",
        "tileheight": project.tileHeight,
        "tilesets": tilesets,
        "tilewidth": project.tileWidth,
        "type": "map",
        "version": 1,
        "width": project.mapWidth,
      }


      console.log(mapJSON)
      const filename = `${project.title}.json`;
      const jsonStr = JSON.stringify(mapJSON);

      let element = document.createElement('a');
      element.style.display = 'none';
      document.body.appendChild(element);

      // download map json
      //element.setAttribute( 'href', download.path );
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
      element.setAttribute('download', filename);
      element.click();

      // console.log(tilesetImages)
      // for( var n = 0; n < tilesetImages.length; n++ )
      // {
      //     var download = tilesetImages[n];
      //     // element.setAttribute( 'href', path );
      //     element.setAttribute( 'download', download );
      //     element.click();
      // }

      document.body.removeChild(element);
      handleCloseExportMap();

    })

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
              sx={{ marginTop: '10px', marginLeft: '15px', marginRight: '15px' }}>Map: {store.currentProject ? (store.currentProject.title.length > 10 ? store.currentProject.title.substring(0, 9) + "..." : store.currentProject.title) : ''}</Typography>

            {/* <Box bgcolor="#ffffff" className="previewWindow" sx={{ marginTop: '30px', marginBottom: '30px' }}>
              <Stack direction='column' textAlign='center'>
                <Typography bgcolor="#1f293a" color='azure'>Preview</Typography>
                <Grid container direction='row' rowSpacing={0} columns={store.currentProject ? store.currentProject.mapWidth : 0} bgcolor='#000000' style={{ height: `250px`, width: `250px` }}>
                  {store.currentMapTiles && store.currentMapTiles.length > 0 && store.currentMapTiles.map((tile, index) => (
                    <MapTile index={index} preview={true} imgSrc={tilesets[tile]}/>
                  ))}
                </Grid>
              </Stack>
            </Box> */}

            <Grid container sx={{ marginTop: '40px' }}>
              <Grid item xs={4}></Grid>
              <Grid item xs={3}>
                <Button  disabled={true}>
                  <ExpandLessIcon style={{ color: 'azure', fontSize: '70px' }} />
                </Button>
              </Grid>
              <Grid item xs={5} ></Grid>

              <Grid item xs={1} sx={{ marginTop: '30px' }}></Grid>
              <Grid item xs={3} >
                <Button disabled={true}>
                  <ChevronLeftIcon style={{ color: 'azure', fontSize: '70px' }} />
                </Button>
              </Grid>
              <Grid item xs={0}></Grid>
              <Grid item xs={3}>
                <Button  disabled={true}>
                  <ExpandMoreIcon style={{ color: 'azure', fontSize: '70px' }} />
                </Button>
              </Grid>
              <Grid item xs={0}></Grid>


              <Grid item xs={0}></Grid>
              <Grid item xs={3}>
                <Button  disabled={true}>
                  <ChevronRightIcon style={{ color: 'azure', fontSize: '70px' }} />
                </Button>
              </Grid>
              <Grid item xs={0}></Grid>
              <Grid item xs={12}>
                <Box style={{margin: '20px 40px 20px 20px'}} alignItems="center" justifyContent="center">
                  <Typography style={{ textAlign: 'center', color: 'azure'}}>Use your arrow keys to view around the map!</Typography>
                </Box>
              </Grid>

            </Grid>

            <Box>
              <Button onClick={handleOpenImportTileset} sx={{ color: 'black', width: '250px', marginTop: '40px', backgroundColor: '#2dd4cf' }}>
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
                  ? <Grid container textAlign='left' style={{ overflow: 'scroll', height: '200px', width: '100%', padding: '5px' }}>
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
                      <Typography style={{ overflowWrap: "break-word", fontSize: '15px' }} color='azure'>{store.currentProject.mapDescription}</Typography>
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
                      <Typography style={{ overflowWrap: "break-word", fontSize: '15px' }} color='azure'>{store.currentProject.tags.join(', ')}</Typography>
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
                      <TextField id='desc_input' defaultValue={store.currentProject.mapDescription} size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', borderRadius: '10px', "& .MuiInputBase-root": { height: 30 } }} />
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
                      <TextField id='tags_input' defaultValue={store.currentProject.tags.join(', ')} size='small' style={{ backgroundColor: 'azure' }} sx={{ marginTop: '5px', borderRadius: '10px', "& .MuiInputBase-root": { height: 30 } }} />
                    </Grid>
                  </Grid>
                }

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
              <TextField id="ts_tile_height_input" value={store.currentProject ? store.currentProject.tileHeight : 0} size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
                sx={{ "& .MuiInputBase-root": { height: 40, width: 70 } }} disabled />
            </Grid>
            <Grid style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} item xs={3}>
              <Typography style={{ fontSize: '20px', textAlign: 'center', marginRight: '12px' }} color='azure'>Tile Width:</Typography>
              <TextField id="ts_tile_width_input" value={store.currentProject ? store.currentProject.tileWidth : 0} size='small' style={{ backgroundColor: 'azure', borderRadius: 10 }}
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
                          {tileset.title.length > 10 ? tileset.title.substring(0, 9) + "..." : tileset.title}
                        </Typography>
                        <Typography variant='h6' sx={{ color: 'white', width: '60%', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex' }}>
                          {tileset.description ? (tileset.description.length > 20 ? tileset.description.substring(0, 19) + "..." : tileset.description) : 'No Description'}
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
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' height='40%' width='40%' top='30%' left='30%'>
          <Stack direction='column'>
            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '50px' }} item xs={12}>
              <Typography variant='h5' style={{ textAlign: 'center', marginRight: '10px' }} color='azure'>Export Map as JSON</Typography>
            </Grid>

            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }} item xs={12}>
              <Typography style={{ fontSize: '14px', textAlign: 'center', marginRight: '10px' }} color='azure'>Map Name: {store.currentProject?.title}</Typography>
            </Grid>

            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '40px' }} item xs={12}>
              <Typography style={{ fontSize: '14px', textAlign: 'center', marginRight: '10px' }} color='azure'>Map Height: {store.currentProject?.mapHeight}</Typography>
              <Typography style={{ fontSize: '14px', textAlign: 'center', marginRight: '10px' }} color='azure'>Map Width: {store.currentProject?.mapWidth}</Typography>
            </Grid>

            <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '40px' }} item xs={12}>
              <Typography style={{ fontSize: '14px', textAlign: 'center', marginRight: '10px' }} color='azure'>Tile Height: {store.currentProject?.tileHeight}</Typography>
              <Typography style={{ fontSize: '14px', textAlign: 'center', marginRight: '10px' }} color='azure'>Tile Width: {store.currentProject?.tileWidth}</Typography>
            </Grid>

            <Stack direction='row'>
              <Button onClick={exportMapAsJSON} sx={{ fontSize: '20px', marginLeft: '30%', marginRight: '50px' }}>
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
        open={openTagsErrorModal}
        onClose={handleCloseTagsErrorModal}
      >
        <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
          <Stack direction='column' style={{ margin: '10px' }}>
            <Typography style={{ textAlign: 'center', marginBottom: '10px' }} variant='h5' color='#2dd4cf'>Error</Typography>
            <Typography style={{ textAlign: 'center' }} color='azure'>Make sure tags are separated with ", "</Typography>
          </Stack>
        </Box>
      </Modal>

    </Box>
  )
}

import React, { useEffect } from 'react'
import { Box, Stack } from '@mui/system';
import { Modal, TextField, Tab, Tabs, FormControl, MenuItem, InputLabel, Select, Typography, List, ListItem, Grid, Button } from '@mui/material'
import { PersonRemove, AccountCircle, People, Edit, IosShare, Clear, AddBox, LibraryAdd, Check, Add, Visibility} from '@mui/icons-material'
import { styled } from "@mui/material/styles";
import { useState, useContext } from 'react';
import { GlobalStoreContext } from '../../../store/store'
import html2canvas from "html2canvas";


export default function TilesetRightBar() {

  const { store } = useContext(GlobalStoreContext)
  const [ value, setValue ] = useState(0);
  const [ openImportTileset, setOpenImportTileset ] = useState(false);
  const [ openImportTile, setOpenImportTile ] = useState(false);
  const [ openExportTileset, setOpenExportTileset ] = useState(false);
  const [ openUserSettings, setOpenUserSettings ] = useState(false);
  const [ editMode, setEditMode ] = useState(false);
  const [ currentTile, setCurrentTile ] = useState(store.currentTile)

  var ndarray = require("ndarray")
  var zeros = require("zeros")

  useEffect(() => {
    setCurrentTile(store.currentTile)
  }, [store.currentTile]) 

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
    store.updateTilesetProperties(store.currentTileset._id, store.currentTileset.ownerId, payload)
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

  const handleOpenUserSettings = () => {
    setOpenUserSettings(true)
  }

  const handleCloseUserSettings = () => {
    setOpenUserSettings(false)
  }


  return (
    <Box bgcolor={"#11182a"} flex={4} className="tile_rightbar">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          centered
          TabIndicatorProps={{style: {backgroundColor: "#2dd4cf"}}}
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
            <Box bgcolor="#ffffff" className="previewWindow">
              <Stack id='preview-window' direction='column' textAlign='center'>
                <Typography bgcolor="#1f293a" color='azure'>Preview</Typography>
                {currentTile
                  ? (<Grid container direction='row' rowSpacing={0} style={{height:'250px', width:'250px'}} columns={currentTile.width} bgcolor='#000000'>
                      {currentTile.tileData.map((pixel, index) => (
                        pixel === ''
                        ? <Grid item xs={1} style={{height:`calc(100% / ${currentTile.width}`}} bgcolor='#fff'></Grid>
                        : <Grid item xs={1} style={{height:`calc(100% / ${currentTile.width}`}} bgcolor={pixel}></Grid>
                      ))}
                    </Grid>)
                  : <div></div>
                }
              </Stack>
            </Box>
          </Box>
        )}
        {value === 1 && (
          <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center">
      
            <Box bgcolor="#ffffff" class="suggestionsContainer">
              <Stack direction='column' textAlign='center' style={{height:'225px'}}>
                <Typography bgcolor="#1f293a" color='azure'>Incoming Suggestions</Typography>
                <List disablePadding style={{maxHeight: '100%', overflow:'auto'}}>
                  <ListItem className='suggestion_item'>
                    <Grid container>
                      <Grid item xs={5} className='suggestion_text'>
                        <Stack direction='column'>
                          <Typography color='black' fontSize='15px'>Added Grass</Typography>
                          <Typography color='black' fontSize='10px'>by McKilla</Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <Visibility className='suggestion_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <Check className='suggestion_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <Clear className='suggestion_icon'/>
                        </Button>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem className='suggestion_item'>
                    <Grid container>
                      <Grid item xs={5} className='suggestion_text'>
                        <Stack direction='column'>
                          <Typography color='black' fontSize='15px'>Added Walls</Typography>
                          <Typography color='black' fontSize='10px'>by McKenna</Typography>
                        </Stack>
                      </Grid>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <Visibility className='suggestion_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <Check className='suggestion_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <Clear className='suggestion_icon'/>
                        </Button>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </Stack>
            </Box>

            <Box className='conferenceContainer'>
              <Stack direction='column' textAlign='center' style={{height:'225px'}}>
                <Typography bgcolor="#1f293a" color='azure'> Conference </Typography>
                <List disablePadding style={{maxHeight: '100%', overflow:'auto'}}>
                  <ListItem className='conference_message' style={{backgroundColor:'azure',borderRadius:'2px',padding:'2px', margin:'5px 0px 5px 0px'}}>
                    <Typography style={{marginRight: '5px'}} size='10px' color='black'> Iman:  </Typography>
                    <Typography size='10px' color='black'> Hey guys! </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{backgroundColor:'azure',borderRadius:'2px',padding:'2px', margin:'5px 0px 5px 0px'}}>
                    <Typography style={{marginRight: '5px'}} size='10px' color='black'> Ahnaf:  </Typography>
                    <Typography size='10px' color='black'> How's it going </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{backgroundColor:'antiquewhite',borderRadius:'2px',padding:'2px', margin:'5px 0px 5px 0px'}}>
                    <Typography style={{marginRight: '5px'}} size='10px' color='black'> Me:  </Typography>
                    <Typography size='10px' color='black'> Working on tiles </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{backgroundColor:'azure',borderRadius:'2px',padding:'2px', margin:'5px 0px 5px 0px'}}>
                    <Typography style={{marginRight: '5px'}} size='10px' color='black'> Vincent:  </Typography>
                    <Typography size='10px' color='black'> Pretty good! </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{backgroundColor:'azure',borderRadius:'2px',padding:'2px', margin:'5px 0px 5px 0px'}}>
                    <Typography style={{marginRight: '5px'}} size='10px' color='black'> Iman:  </Typography>
                    <Typography size='10px' color='black'> Cool! I'm deploying it rn </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{backgroundColor:'azure',borderRadius:'2px',padding:'2px', margin:'5px 0px 5px 0px'}}>
                    <Typography style={{marginRight: '5px'}} size='10px' color='black'> Ahnaf:  </Typography>
                    <Typography size='10px' color='black'> Lmk if you guys need help </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{backgroundColor:'antiquewhite',borderRadius:'2px',padding:'2px', margin:'5px 0px 5px 0px'}}>
                    <Typography style={{marginRight: '5px'}} size='10px' color='black'> Me:  </Typography>
                    <Typography size='10px' color='black'> Yep </Typography>
                  </ListItem>
                  <ListItem className='conference_message' style={{backgroundColor:'azure',borderRadius:'2px',padding:'2px', margin:'5px 0px 5px 0px'}}>
                    <Typography style={{marginRight: '5px'}} size='10px' color='black'> Vincent:  </Typography>
                    <Typography size='10px' color='black'> Sounds good </Typography>
                  </ListItem>
                </List>
                <Box justifyContent='right' style={{backgroundColor:'#1f293a'}}>
                  <Grid container>
                    <Grid item xs={10}>
                      <TextField size='small' style={{backgroundColor:'azure'}} sx={{marginTop:'5px', "& .MuiInputBase-root": {height: 20}}}/>
                    </Grid>
                    <Grid item xs={2}>
                      <Button style={{minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px'}}>
                        <Add />
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Button onClick={handleOpenUserSettings} sx={{color:'black', width:'250px', marginTop: '15px', backgroundColor:'#2dd4cf'}}>
                <Typography>User Settings</Typography>
                <People/>
              </Button>
            </Box>

          </Box>
        )}
        {value === 2 && (
          <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center">

            <Box className='properties_container'>
              <Stack direction='column' textAlign='center' style={{height:'225px'}}>
                {!editMode 
                    ? <Grid container style={{backgroundColor:"#1f293a", height:'30px'}}>
                        <Grid item xs={10}>
                          <Typography color='azure'>Properties</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Button onClick={startEditing} style={{minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px'}}>
                            <Edit/>
                          </Button>
                        </Grid>
                      </Grid>
                    : <Grid container style={{backgroundColor:"#1f293a", height:'30px'}}>
                        <Grid item xs={8}>
                          <Typography color='azure'>Properties</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Button onClick={handleUpdateProperties} style={{minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px'}}>
                            <Check/>
                          </Button>
                        </Grid>
                        <Grid item xs={2}>
                          <Button onClick={endEditing} style={{minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px'}}>
                            <Clear/>
                          </Button>
                        </Grid>
                      </Grid>
                  }
                {!editMode
                    ? <Grid container textAlign='left' style={{height: '195px', width: '100%', padding: '5px'}}>
                        <Grid item xs={3}>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>Name: </Typography>
                        </Grid>
                        <Grid item xs={9} zeroMinWidth>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>{store.currentTileset.title}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>Desc: </Typography>
                        </Grid>
                        <Grid item xs={9} zeroMinWidth>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>{store.currentTileset.tilesetDesc}</Typography>
                        </Grid>
                        <Grid item xs={5}>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>Tile Size: </Typography>
                        </Grid>
                        <Grid item xs={7} zeroMinWidth>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>{store.currentTileset.tileHeight + " x " + store.currentTileset.tileWidth}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>Tags: </Typography>
                        </Grid>
                        <Grid item xs={9} zeroMinWidth>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>{store.currentTileset.tilesetTags}</Typography>
                        </Grid>
                      </Grid>
                    : <Grid container textAlign='left' style={{height: '195px', width: '100%', padding: '5px'}}>
                        <Grid item xs={3}>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>Name: </Typography>
                        </Grid>
                        <Grid item xs={9} zeroMinWidth>
                          <TextField id='title_input' defaultValue={store.currentTileset.title} size='small' style={{backgroundColor:'azure'}} sx={{marginTop:'5px', "& .MuiInputBase-root": {height: 20}}}/>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>Desc: </Typography>
                        </Grid>
                        <Grid item xs={9} zeroMinWidth>
                          <TextField id='desc_input' defaultValue={store.currentTileset.tilesetDesc} size='small' style={{backgroundColor:'azure'}} sx={{marginTop:'5px', "& .MuiInputBase-root": {height: 20}}}/>
                        </Grid>
                        <Grid item xs={5}>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>Tile Size: </Typography>
                        </Grid>
                        <Grid item xs={7} zeroMinWidth>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>{store.currentTileset.tileHeight + " x " + store.currentTileset.tileWidth}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography style={{overflowWrap:"break-word"}} color='azure'>Tags: </Typography>
                        </Grid>
                        <Grid item xs={9} zeroMinWidth>
                          <TextField id='tags_input' defaultValue={store.currentTileset.tilesetTags} size='small' style={{backgroundColor:'azure'}} sx={{marginTop:'5px', "& .MuiInputBase-root": {height: 20}}}/>
                        </Grid>
                      </Grid>
                }
          
              </Stack>
            </Box>

            <Box>
              <Button onClick={handleOpenImportTile} sx={{color:'black', width:'250px', marginTop: '15px', backgroundColor:'#2dd4cf'}}>
                <Typography>Import Tile</Typography>
                <AddBox style={{marginLeft:'8px'}}/>
              </Button>
            </Box>
            <Box>
              <Button onClick={handleOpenImportTileset} sx={{color:'black',width:'250px', marginTop: '15px', backgroundColor:'#2dd4cf'}}>
                <Typography>Import Tileset</Typography>
                <LibraryAdd style={{marginLeft:'8px'}}/>
              </Button>
            </Box>
            <Box>
              <Button onClick={handleOpenExportTileset} sx={{color:'black',width:'250px', marginTop: '15px', backgroundColor:'#2dd4cf'}}>
                <Typography>Export Tileset</Typography>
                <IosShare style={{marginLeft:'8px'}}/>
              </Button>
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
            <TextField size='small' style={{backgroundColor:'azure'}} sx={{marginTop:'5px', "& .MuiInputBase-root": {height: 20}}}/>
            <Stack direction='row'>
              <Button onClick={handleCloseImportTileset}>
                <Typography >Confirm</Typography>
                <Check/>
              </Button>
              <Button onClick={handleCloseImportTileset}>
                <Typography>Cancel</Typography>
                <Clear/>
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
            <TextField size='small' style={{backgroundColor:'azure'}} sx={{marginTop:'5px', "& .MuiInputBase-root": {height: 20}}}/>
            <Stack direction='row'>
              <Button onClick={handleCloseImportTile}>
                <Typography >Confirm</Typography>
                <Check/>
              </Button>
              <Button onClick={handleCloseImportTile}>
                <Typography>Cancel</Typography>
                <Clear/>
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
            <TextField size='small' style={{backgroundColor:'azure'}} sx={{marginTop:'5px', "& .MuiInputBase-root": {height: 20}}}/>
            <Stack direction='row'>
              <Button onClick={handleCloseExportTileset}>
                <Typography >Confirm</Typography>
                <Check/>
              </Button>
              <Button onClick={handleCloseExportTileset}>
                <Typography>Cancel</Typography>
                <Clear/>
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
            <Typography style={{textAlign:'center', marginBottom:'5px'}} variant='h5' color='azure'>User Settings</Typography>
            <Grid justify='center' container style={{backgroundColor:"#1f293a"}}>
              <Grid item xs={1}>
                <AccountCircle/>
              </Grid>
              <Grid item xs={5}>
                <Typography>Iman Ali</Typography>
              </Grid>
              <Grid item xs={1}>
                <Button style={{minHeight: '30px', maxHeight:'30px', minWidth:'30px', maxWidth:'30px'}}>
                  <People/>
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button style={{minHeight: '30px', maxHeight:'30px', minWidth:'30px', maxWidth:'30px'}}>
                  <PersonRemove/>
                </Button>
              </Grid>
              <Grid align='center' item xs={4}>
                <Typography>Owner</Typography>
              </Grid>
            </Grid>
            <Grid container style={{backgroundColor:"#1f293a"}}>
              <Grid item xs={1}>
                <AccountCircle/>
              </Grid>
              <Grid item xs={5}>
                <Typography>Iman Ali</Typography>
              </Grid>
              <Grid item xs={1}>
                <Button style={{minHeight: '30px', maxHeight:'30px', minWidth:'30px', maxWidth:'30px'}}>
                  <People/>
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button style={{minHeight: '30px', maxHeight:'30px', minWidth:'30px', maxWidth:'30px'}}>
                  <PersonRemove/>
                </Button>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Acess</InputLabel>
                  <Select
                  >
                    <MenuItem>View</MenuItem>
                    <MenuItem>Edit</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container style={{backgroundColor:"#1f293a"}}>
              <Grid item xs={1}>
                <AccountCircle/>
              </Grid>
              <Grid item xs={5}>
                <Typography>McKenna</Typography>
              </Grid>
              <Grid item xs={1}>
                <Button style={{minHeight: '30px', maxHeight:'30px', minWidth:'30px', maxWidth:'30px'}}>
                  <People/>
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button style={{minHeight: '30px', maxHeight:'30px', minWidth:'30px', maxWidth:'30px'}}>
                  <PersonRemove/>
                </Button>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Acess</InputLabel>
                  <Select
                  >
                    <MenuItem>View</MenuItem>
                    <MenuItem>Edit</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Stack direction='row' justifyContent='space-between'>
              <Button onClick={handleCloseUserSettings}>
                <Typography >Confirm</Typography>
                <Check/>
              </Button>
              <Button onClick={handleCloseUserSettings}>
                <Typography>Cancel</Typography>
                <Clear/>
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}

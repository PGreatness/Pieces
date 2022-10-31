import React from 'react'
import { Box, Stack } from '@mui/system';
import { Slider, TextField, Tab, Tabs, Typography, TabIndicatorProps, List, ListItem, Grid, Button } from '@mui/material'
import { Brush, HighlightAlt, OpenWith, FormatColorFill, Colorize, Edit, Clear, SwapHoriz, ContentCopy, Delete, ArrowUpward, Check, ArrowDownward,Add, Visibility} from '@mui/icons-material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { TabPanel, TabContext, TabList} from '@mui/lab'
import { styled } from "@mui/material/styles";

export default function MapRightBar() {

  const [ value, setValue ] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  const StyledTab = styled(Tab)({
    "&.Mui-selected": {
      color: "#2dd4cf"
    }
  });

  return (
    <Box bgcolor={"#11182a"} flex={4} className="map_rightbar">
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
              <Stack direction='column' textAlign='center'>
                <Typography bgcolor="#1f293a" color='azure'>Preview</Typography>
                <img src='../images/dummyMapPreview.png' id="map_preview"/>
              </Stack>
            </Box>
            <Box bgcolor="#ffffff" class="layersContainer">
              <Stack direction='column' textAlign='center' style={{height:'225px'}}>
                <Typography bgcolor="#1f293a" color='azure'>Layers</Typography>
                <List disablePadding style={{maxHeight: '100%', overflow:'auto'}}>
                  <ListItem className='layer_item'>
                    <Grid container>
                      <Grid item xs={3} className='layer_text'>
                        <Typography color='black' fontSize='15px'>Layer 1</Typography>
                      </Grid>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <ContentCopy className='layers_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <ArrowUpward className='layers_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <ArrowDownward className='layers_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <Delete className='layers_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Slider size='small' defaultValue={100} marks={[0,50,100]} sx={{padding:'0px','& .MuiSlider-thumb': {borderRadius: '1px', height:'5px', width:'7px'}}}/>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem className='layer_item'>
                    <Grid container>
                      <Grid item xs={3} className='layer_text'>
                        <Typography color='black' fontSize='15px'>Layer 2</Typography>
                      </Grid>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <ContentCopy className='layers_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <ArrowUpward className='layers_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <ArrowDownward className='layers_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <Delete className='layers_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Slider size='small' defaultValue={100} marks={[0,50,100]} sx={{padding:'0px','& .MuiSlider-thumb': {borderRadius: '1px', height:'5px', width:'7px'}}}/>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem className='layer_item'>
                    <Grid container>
                      <Grid item xs={3} className='layer_text'>
                        <Typography color='black' fontSize='15px'>Layer 3</Typography>
                      </Grid>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <ContentCopy className='layers_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <ArrowUpward className='layers_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <ArrowDownward className='layers_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={2}>
                        <Button size="small" className="small_button" style={{maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                          <Delete className='layers_icon'/>
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Slider size='small' defaultValue={100} marks={[0,50,100]} sx={{padding:'0px','& .MuiSlider-thumb': {borderRadius: '1px', height:'5px', width:'7px'}}}/>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
                <Box justifyContent='right' style={{backgroundColor:'#1f293a'}}>
                  <Button>
                    <Add/>
                  </Button>
                </Box>
              </Stack>
            </Box>
            <Box>
              <Button sx={{width:'250px', marginTop: '15px', backgroundColor:'#2dd4cf'}}>
                Import Tileset
              </Button>
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
                    <Typography size='10px' color='black'> Working on maps </Typography>
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
              <Button sx={{width:'250px', marginTop: '15px', backgroundColor:'#2dd4cf'}}>
                Permissions & Users
              </Button>
            </Box>

          </Box>
        )}
        {value === 2 && (
          <Box display="flex" flexDirection='column' alignItems="center" justifyContent="center">

            <Box className='properties_container'>
              <Stack direction='column' textAlign='center' style={{height:'225px'}}>
                <Grid container style={{backgroundColor:"#1f293a", height:'30px'}}>
                  <Grid item xs={10}>
                    <Typography color='azure'>Properties</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button style={{minHeight: '30px', minWidth: '30px', maxHeight: '30px', maxWidth: '30px'}}>
                      <Edit/>
                    </Button>
                  </Grid>
                </Grid>
                <Grid container textAlign='left' style={{height: '195px', width: '100%', padding: '5px'}}>
                  <Grid item xs={3}>
                    <Typography style={{overflowWrap:"break-word"}} color='azure'>Name: </Typography>
                  </Grid>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography style={{overflowWrap:"break-word"}} color='azure'>Simple Grassy Plains Map </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography style={{overflowWrap:"break-word"}} color='azure'>Desc: </Typography>
                  </Grid>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography style={{overflowWrap:"break-word"}} color='azure'>An orthogonal 2D map that resembles a grassy plain. </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography style={{overflowWrap:"break-word"}} color='azure'>Size: </Typography>
                  </Grid>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography style={{overflowWrap:"break-word"}} color='azure'>64 x 64 </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography style={{overflowWrap:"break-word"}} color='azure'>Tags: </Typography>
                  </Grid>
                  <Grid item xs={9} zeroMinWidth>
                    <Typography style={{overflowWrap:"break-word"}} color='azure'>Grassy, Plains, Pixel </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Box>

            <Box>
              <Button sx={{width:'250px', marginTop: '15px', backgroundColor:'#2dd4cf'}}>
                Import Map
              </Button>
            </Box>
            <Box>
              <Button sx={{width:'250px', marginTop: '15px', backgroundColor:'#2dd4cf'}}>
                Export Map
              </Button>
            </Box>

          </Box>
        )}
      </Box>
    </Box>
  )
}

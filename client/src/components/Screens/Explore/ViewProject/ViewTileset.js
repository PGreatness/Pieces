import React from 'react';
import { Box, Stack } from '@mui/system';
import { Modal, Typography, Button, Tabs, Tab, Grid } from '@mui/material'
import { GlobalStoreContext } from '../../../../store/store';
import { useParams } from 'react-router-dom';
export default function ViewTileset() {

    const { store } = React.useContext(GlobalStoreContext);

    const { id } = useParams();
    const [tileset, setTileset] = React.useState([])
    const [currentTile, setCurrentTile] = React.useState(null);
    const [width, setWidth] = React.useState(currentTile ? currentTile.width : 0)
    const [value, setValue] = React.useState(0);

    const [isLoading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (id) {
            store.loadTileset(id, true).then((res) => {
                console.log(res.currentTile)
                setTileset(res.currentProject)
                setCurrentTile(res.currentTile);
                setWidth(res.currentTile.width)
                setLoading(false);
            });
        }
    }, [id]);

    const handleSelectTile = async (tileId) => {
        //await store.setCurrentTile(tileId)
        //setCurrentTile(store.currentTile)
    }

    if (isLoading) {
        return <div className="App">Loading...</div>;
      } else {
    return (
        <Box className='canvas_container' bgcolor={"#1f293a"} flex={10}>

            {currentTile
                ? <Grid container direction='row' id='tileset-canvas-grid'
                    rowSpacing={0} columns={width} bgcolor='#000000'
                    // style={{ position: 'absolute', height: '65vh', width: '65vh', top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }}
                    >
                    {currentTile.tileData.map((pixel, index) => (
                        pixel === ''
                            ? <Grid id={`pixel_${index}`} className='pixel' item xs={1} style={{ borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.05)', borderWidth: '0.5px', height: `calc(100% / ${width}` }} bgcolor='#fff'></Grid>
                            : <Grid id={`pixel_${index}`} className='pixel' item xs={1} style={{ height: `calc(100% / ${width}` }} bgcolor={pixel}></Grid>
                    ))}
                </Grid>
                : null
            }

            <Box bgcolor="#11182a" className="tileset_container">
                <Box bgcolor="#11182a" 
                // style={{ borderRadius: '15px 15px 0px 0px', height: '30px', width: '15%', position: 'absolute', bottom: '100%' }}
                >
                    <Typography style={{ color: 'azure' }}>Tileset</Typography>
                </Box>
                <Box sx={{ padding: 2 }}>
                    {value === 0 && (
                        <Stack direction='row' sx={{ overflowX: 'scroll' }}>

                            {tileset && tileset.tiles?.length > 0
                                ? tileset?.tiles.map((tileId) => (
                                    <Box className='tile_option'>
                                        <img src={require('../../../Editors/images/dummyTilePreview.png')} className='tile_option_image' />
                                        <Button style={{ padding: '0px', maxWidth: '65%', top: '0px', left: '0px', minWidth: '65%' }} className='tile_option_select' onClick={() => handleSelectTile(tileId)}></Button>
                                    </Box>
                                ))
                                : null
                            }
                        </Stack>
                    )}
                </Box>
            </Box>

        </Box>
    );}
}
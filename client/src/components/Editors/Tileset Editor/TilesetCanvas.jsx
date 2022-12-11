import React from 'react'
import { Box, Stack } from '@mui/system';
import { Modal, Typography, Button, Tabs, Tab, Grid } from '@mui/material'
import { Undo, Redo, Add, Translate, Delete, ContentCopy } from '@mui/icons-material'
import { styled } from "@mui/material/styles";
import { useState, useContext, useEffect } from 'react';
import { GlobalStoreContext } from '../../../store/store'
import AuthContext from '../../../auth/auth';


export default function TilesetCanvas() {

    // Tileset Editor Code Begin

    const { store } = useContext(GlobalStoreContext)
    const { auth } = useContext(AuthContext);


    const [ tileset, setTileset ] = useState(store.currentProject)
    const [ currentTile, setCurrentTile ] = useState(store.currentTile)
    const [ height, setHeight ] = useState(store.currentTile ? store.currentTile.height : 0)
    const [ width, setWidth ] = useState(store.currentTile ? store.currentTile.width : 0)
    const [ currentPixel, setCurrentPixel ] = useState([0, 0])
    const [ movePixels, setMovePixels ] = useState([])
    const [ openDeleteLastTileModal, setOpenDeleteLastTileModal ] = useState(false)
    const [ redoColor, setRedoColor ] = useState(store.canRedo ? '#2dd4cf' : '#1f293a')
    const [ undoColor, setUndoColor ] = useState(store.canUndo ? '#2dd4cf' : '#1f293a')



    useEffect(() => {
        auth.socket.on('recieveUpdateTileset', (data) => {
            // check if the socket that sent the message is auth.socket
            if (data.socketId === auth.socket.id) return;
            console.log('Recieved Tileset Update');
            console.log(data);
            // setTileset(data.tileset);
            store.loadTileset(data.project).then(()=>{
                console.log("Tileset fully loaded");
            });
        })
    }, [auth.socket])

    useEffect(() => {
        console.log(store.currentProject.tiles)
        setTileset(store.currentProject)
    }, [store.currentProject])
    
    useEffect(() => {
        console.log(store.currentProject.tiles)
        setCurrentTile(store.currentTile)
        setHeight(store.currentTile ? store.currentTile.height : 0)
        setWidth(store.currentTile ? store.currentTile.width : 0)
    }, [store.currentTile])

    useEffect(() => {
        setUndoColor(store.canUndo ? '#2dd4cf' : '#1f293a')
        setRedoColor(store.canRedo ? '#2dd4cf' : '#1f293a')
    }, [store.canUndo, store.canRedo])

    const redo = async () => {
        if (store.currentStackIndex < store.transactionStack.length - 1) {
            let tile = currentTile
            tile.tileData = store.transactionStack[store.currentStackIndex + 1].new
            setCurrentTile(tile)
            let imgSrc = convertToImage(tile);
            await store.updateTile(store.currentTile._id, currentTile.tilesetId, currentTile.tileData, imgSrc)
            await store.redo()
            auth.socket.emit('updateTileset', { project: store.currentProject._id, tileset: tileset })
        }
    }
 
    const undo = async () => {
        if (store.currentStackIndex > -1) {
            let tile = currentTile
            tile.tileData = store.transactionStack[store.currentStackIndex].old
            setCurrentTile(tile)
            let imgSrc = convertToImage(tile);
            await store.updateTile(store.currentTile._id, currentTile.tilesetId, currentTile.tileData, imgSrc)
            await store.undo()
            auth.socket.emit('updateTileset', { project: store.currentProject._id, tileset: tileset })
        }
    }
 


    // Auto Update code (not working rn)
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (store.currentTile) {
    //             store.updateTile(store.currentTile._id, currentTile.tilesetId, currentTile.tileData)
    //             console.log("Auto updated")
    //         }
    //     }, 5000);

    //     return () => clearInterval(interval);
    //   }, []); 

    const handleAddTile = async () => {
        await store.addTileToCurrentTileset()
    }

    const handleSelectTile = async (tileId) => {
        // console.log(store.currentProject.tiles)
        // await store.updateTile(store.currentTile._id, currentTile.tilesetId, currentTile.tileData)
        await store.setCurrentTile(tileId)
        setCurrentTile(store.currentTile)
    }

    const handleHoverPixel = (e) => {
        let id = Number(e.currentTarget.id.replace("pixel_", ""))
        let x = Math.floor(id / width)
        let y = id % width
        setCurrentPixel([x, y])
    }

    const fillHelper = (x, y, originalColor) => {
        let tile = currentTile
        if (x < 0 || x >= height || y < 0 || y >= width) {
            return
        }
        if (tile.tileData[x * width + y] === originalColor) {
            tile.tileData[x * width + y] = store.primaryColor
            fillHelper(x - 1, y, originalColor)
            fillHelper(x + 1, y, originalColor)
            fillHelper(x, y + 1, originalColor)
            fillHelper(x, y - 1, originalColor)
            setCurrentTile(tile)
        }
    }

    const convertToImage = (tile) => {
        let rgba = []
        let height = store.currentTile.height
        let width = store.currentTile.height
  
        tile.tileData.forEach((tile) => {
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
  
        console.log(rgba.length)
  
        var rgbaArray = new ImageData(new Uint8ClampedArray(rgba), width, height);
  
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.height = height
        canvas.width = width
  
        context.putImageData(rgbaArray, 0, 0);
        var imgSrc = canvas.toDataURL();
        canvas.remove();
        return imgSrc
    }
 
 
 const checkArrayEqual = (arr1, arr2) => {
        return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
    }
  
    const handleClickPixel = async (e) => {
  
        let tile = currentTile
        let imgSrc = ''
        let oldData = [...tile.tileData]
  
        switch (store.tilesetTool) {
            case 'brush':
                tile.tileData[currentPixel[0] * width + currentPixel[1]] = store.primaryColor
  
                if (checkArrayEqual(oldData, tile.tileData)) {
                    console.log("tile did not change")
                    return
                }
  
                setCurrentTile(tile)
                console.log(store.transactionStack)
                await store.updateTile(store.currentTile._id, currentTile.tilesetId, currentTile.tileData, imgSrc)
                auth.socket.emit('updateTileset', { project: store.currentProject._id, tileset: tileset })
                await store.addTransaction(oldData, [...store.currentTile.tileData])
                break
  
            case 'eraser':
                tile.tileData[currentPixel[0] * width + currentPixel[1]] = ''
  
                if (checkArrayEqual(oldData, tile.tileData)) {
                    console.log("tile did not change")
                    return
                }
  
                setCurrentTile(tile)
                imgSrc = convertToImage(tile);
                await store.updateTile(store.currentTile._id, currentTile.tilesetId, currentTile.tileData, imgSrc)
                auth.socket.emit('updateTileset', { project: store.currentProject._id, tileset: tileset })
                await store.addTransaction(oldData, [...store.currentTile.tileData])
                break
  
            case 'dropper':
                store.setPrimaryColor(tile.tileData[currentPixel[0] * width + currentPixel[1]])
                break
  
            case 'bucket':
                let originalColor = currentTile.tileData[currentPixel[0] * width + currentPixel[1]]
  
                if (originalColor === store.primaryColor) {
                    console.log("tile did not change")
                    return
                }
  
                await fillHelper(currentPixel[0], currentPixel[1], originalColor)
  
                imgSrc = convertToImage(tile);
                await store.updateTile(store.currentTile._id, currentTile.tilesetId, currentTile.tileData, imgSrc)
                auth.socket.emit('updateTileset', { project: store.currentProject._id, tileset: tileset })
                await store.addTransaction(oldData, [...store.currentTile.tileData])
                break
  
        }
    }

    const handleDeleteTile = async (tileId) => {
        console.log("Deleting tile " + tileId + " for user " + auth.user)
        if (store.currentProject.tiles.length === 1) {
            console.log("LAST TILE DON'T DELETE")
            handleOpenDeleteLastTileModal()
            return
        }
        await store.deleteTileById(tileId, auth.user._id)
    }

    const handleDuplicateTile = (tileId) => {
        console.log("Duplicating tile " + tileId)
    }

    // Tileset Editor Code End

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const handleOpenDeleteLastTileModal = () => {
        setOpenDeleteLastTileModal(true)
    }

    const handleCloseDeleteLastTileModal = () => {
        setOpenDeleteLastTileModal(false)
    }

    const StyledTab = styled(Tab)({
        "&.Mui-selected": {
            color: "#2dd4cf"
        }
    });

    return (
        <Box className='canvas_container' bgcolor={"#1f293a"} flex={10}>
            <Typography variant='h5' id='cursor_coord' color='azure'>{currentPixel[0] + ", " + currentPixel[1]}</Typography>
            <Button onClick={undo} disabled={!store.canUndo} id='tile_undo_button' sx={{ minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px' }}>
                <Undo style={{color: undoColor}} className='toolbar_mui_icon' />
            </Button>
            <Button onClick={redo} disabled={!store.canRedo} id='tile_redo_button' sx={{ minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px' }}>
                <Redo style={{color: redoColor}} className='toolbar_mui_icon' />
            </Button>


            {currentTile 
                ? <Grid container direction='row' id='tileset-canvas-grid'
                    rowSpacing={0} columns={width} bgcolor='#000000'
                    style={{ position: 'absolute', height: '65vh', width: '65vh', top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }}>
                    {currentTile.tileData.map((pixel, index) => (
                            pixel === ''
                                ? <Grid onMouseOver={handleHoverPixel} onClick={handleClickPixel} id={`pixel_${index}`} className='pixel' item xs={1} style={{ borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.05)', borderWidth: '0.5px', height: `calc(100% / ${width}` }} bgcolor='#fff'></Grid>
                                : <Grid onMouseOver={handleHoverPixel} onClick={handleClickPixel} id={`pixel_${index}`} className='pixel' item xs={1} style={{ height: `calc(100% / ${width}` }} bgcolor={pixel}></Grid>
                    ))}
                </Grid>
                // : <Box style={{height: '80%', display:'flex', flexWrap: 'wrap', alignItems:'center', justifyContent:'center'}}>
                //     <Typography>Please create a tile to start working!</Typography>
                // </Box>
                : null
            }

            <Box bgcolor="#11182a" className="tileset_container">
                <Box bgcolor="#11182a" style={{ borderRadius: '15px 15px 0px 0px', height: '30px', width: '15%', position: 'absolute', bottom: '100%' }}>
                    <Typography style={{ color: 'azure' }}>Tileset</Typography>
                </Box>
                <Box sx={{ padding: 2 }}>
                    {value === 0 && (
                        <Stack direction='row' sx={{overflowX: 'scroll'}}>
                            {/* {console.log("tileset tiles")} */}
                            {/* {console.log(tileset.tiles)} */}
                            {tileset && tileset.tiles.length > 0
                                ? tileset?.tiles.map((tileId) => (
                                    <Box className='tile_option'>
                                        <img src={require('../images/dummyTilePreview.png')} onClick={() => handleSelectTile(tileId)} className='tile_option_image'/>
                                        <Button style={{padding: '0px', maxWidth: '65%', top: '0px', left: '0px', minWidth: '65%'}} className='tile_option_select' onClick={() => handleSelectTile(tileId)}></Button>
                                        <Button onClick={() => handleDeleteTile(tileId)} style={{backgroundColor: 'rgba(11,11,11,0.7)', padding: '0px', maxWidth: '30%', minWidth: '30%'}} className='tile_option_delete'><Delete style={{color:'azure', height: '80%', width: '80%'}}/></Button>  
                                        {/* <Button onClick={() => handleDuplicateTile(tileId)} style={{backgroundColor: 'rgba(11,11,11,0.7)', padding: '0px', maxWidth: '30%', minWidth: '30%'}} className='tile_option_dupe'><ContentCopy style={{color:'azure', height: '70%', width: '70%'}}/></Button>   */}
                                    </Box>
                                ))
                                : null
                            }   
                            <Button>
                                <Add onClick={handleAddTile} style={{ minHeight: '80px', maxHeight: '80px', minWidth: '80px', maxWidth: '80px' }} />
                            </Button>

                        </Stack>
                    )}
                </Box>
            </Box>

            <Modal
                open={openDeleteLastTileModal}
                onClose={handleCloseDeleteLastTileModal}
            >
                <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' top='40%' left='40%'>
                <Stack direction='column' style={{margin:'10px'}}>
                    <Typography style={{textAlign:'center', marginBottom:'10px'}} variant='h5' color='#2dd4cf'>Warning</Typography>
                    <Typography style={{textAlign:'center'}} color='azure'>Can't delete the last tile in the tileset!</Typography>
                    <Typography style={{textAlign:'center'}} color='azure'>Did you mean to delete the whole tileset?</Typography>
                </Stack>
                </Box>
            </Modal>

            {/* <img style={{marginTop:'50px', height:'450px', width:'450px'}} src={require('../images/dummyTilePreview.png')} className='tile_canvas'/> */}
        </Box>
    )
}

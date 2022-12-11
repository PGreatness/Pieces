import React from 'react'
import { Grid } from "@mui/material"
import { GlobalStoreContext } from '../../../store/store'
import { useState, useContext, useEffect } from 'react'

export default function Pixel(props) {

    const { store } = useContext(GlobalStoreContext)

    const handleClickPixel = () => {
        console.log("Clicked Pixel " + props.index)
        console.log(store.currentTile)
    }

    return (
        <Grid item xs={1} 
            id={`pixel_${props.index}`} 
            className='pixel' 
            /*onMouseOver={props.handleHoverPixel} */
            onClick={handleClickPixel} 
            bgcolor={store.currentTile.tileData[props.index] !== '' ? store.currentTile.tileData[props.index] : '#fff'}
            style={{ borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.05)', borderWidth: '0.5px',  height: props.height }}
        >

        </Grid>
    )
}
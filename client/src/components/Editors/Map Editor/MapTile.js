import React from 'react'
import { Grid } from "@mui/material"
import { GlobalStoreContext } from '../../../store/store'
import { useState, useContext, useEffect } from 'react'

export default function MapTile(props) {
    
    const { store } = useContext(GlobalStoreContext)

    const [ imgSrc, setImgSrc ] = useState(store.currentMapTiles[props.index])
    const [ filled, setFilled ] = useState(props.filled)
    
    const handleClickTile = () => {
        switch (store.tilesetTool) {
            case 'brush':
                // setImgSrc(store.primaryTile)
                setFilled(true)
                props.updateCurrentMapTiles(store.primaryTile, props.index)
                break

            case 'eraser':
                setImgSrc('')
                setFilled(false)
                props.updateCurrentMapTiles(imgSrc, props.index)
                break

            case 'dropper':
                store.setPrimaryTile(store.currentMapTiles[props.index])
                break

            case 'bucket':
                props.handleBucket()
                break

        }
    }
    

    return (

        <Grid onMouseOver={(event) => props.handleHoverTile(event)} onClick={handleClickTile} id={`tile_${props.index}`} className='tile' item xs={1} style={{borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.05)', borderWidth: '0.5px', height:`calc(100% / ${props.mapHeight}`}} bgcolor='#fff'>
            {store.currentMapTiles[props.index] !== ''
                ? <img style={{width: '100%', height: '100%'}} src={store.currentMapTiles[props.index]}></img>
                : <div></div>
            }   
        </Grid>
    )
}

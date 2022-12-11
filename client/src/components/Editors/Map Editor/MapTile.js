import React from 'react'
import { Grid } from "@mui/material"
import { GlobalStoreContext } from '../../../store/store'
import { useState, useContext, useEffect } from 'react'

export default function MapTile(props) {
    
    const { store } = useContext(GlobalStoreContext)

    const [ imgSrc, setImgSrc ] = useState(props.imgSrc)
    const [ filled, setFilled ] = useState(props.filled)
    
    useEffect(() => {
        console.log('map tile updated')
        setImgSrc(props.imgSrc)
        setFilled(props.filled)
    }, [props.imgSrc, props.filled])
    const handleClickTile = () => {
        console.log(props.imgSrc)
        switch (store.tilesetTool) {
            case 'brush':
                console.log('brush')
                props.setSrc(store.primaryTile)
                setFilled(true)
                break

            case 'eraser':
                props.setSrc('')
                setFilled(false)
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

        <Grid onMouseOver={(event) => props.handleHoverTile ? props.handleHoverTile(event) : null}
            onClick={!props.preview ? handleClickTile : null} 
            id={`tile_${props.index}`}
            className='tile' item xs={1}
            style={{borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.05)', borderWidth: '0.5px', minHeight:`calc(100% / ${props.mapHeight}`, maxHeight:`calc(100% / ${props.mapHeight}`}} bgcolor='#fff'>
            {imgSrc
                ? <img style={{width: '100%', height: '100%'}} src={imgSrc?.tileImage}></img>
                : <div style={{width: '100%', height: '100%'}}></div>
            }
        </Grid>
    )
}

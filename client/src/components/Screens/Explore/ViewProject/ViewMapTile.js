import React from 'react'
import { Grid } from "@mui/material";

export default function ViewMapTile(props) {

    return (

        <Grid onMouseOver={() => null}
            onClick={null}
            id={`tile_${props.index}`}
            className='tile' item xs={1}
            style={{ borderStyle: 'solid', borderColor: 'rgba(0, 0, 0, 0.05)', borderWidth: '0.5px', minHeight: `calc(100% / ${props.mapHeight}`, maxHeight: `calc(100% / ${props.mapHeight}` }} bgcolor='#fff'>
            {props.currentMapTiles && props.currentMapTiles[props.index] !== -1
                ? <img style={{ width: '100%', height: '100%' }} src={props.mapTiles[props.currentMapTiles[props.index]]?.tileImage}></img>
                : <div style={{ width: '100%', height: '100%' }}></div>
            }
        </Grid>
    )
}

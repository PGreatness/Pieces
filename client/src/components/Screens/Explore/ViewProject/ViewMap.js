import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ViewMapTile from './ViewMapTile';
import { GlobalStoreContext } from '../../../../store/store';
import { useParams } from 'react-router-dom';
export default function ViewMap() {

    const { store } = React.useContext(GlobalStoreContext);

    const { id } = useParams();
    const [ currentMapTiles, setCurrentMapTiles ] = React.useState([]);
    const [ mapTiles, setMapTiles ] = React.useState([]);
    const [ mapWidth, setMapWidth ] = React.useState(1);
    const [ mapHeight, setMapHeight ] = React.useState(1);
    const [ renderWidthRatio, setRenderWidthRatio ] = React.useState(mapWidth / Math.max(mapWidth, mapHeight));
    const [ renderHeightRatio, setRenderHeightRatio ] = React.useState(mapHeight / Math.max(mapWidth, mapHeight));

    React.useEffect(() => {
        if (id) {
            store.loadMap(id, true).then((map) => {
                setCurrentMapTiles(map.currentMapTiles);
                setMapWidth(map.width);
                setMapHeight(map.height);
                setMapTiles(map.mapTiles);
                setRenderWidthRatio(map.width / Math.max(map.width, map.height));
                setRenderHeightRatio(map.height / Math.max(map.width, map.height));
            });
        }
    }, [id]);

    return (
        <Box className='canvas_container' bgcolor={"#1f293a"} flex={10} sx={{height: '100vh'}}>

            <Grid container direction='row' rowSpacing={0} columns={mapWidth} bgcolor='#000000' style={{ position: 'absolute', height: `${70 * renderHeightRatio}vh`, width: `${70 * renderWidthRatio}vh`, top: '50%', left: '50%', transform: 'translate(-50%, -60%)' }}>
                {currentMapTiles?.length > 0 && currentMapTiles.map((tile, index) => (
                    <ViewMapTile
                        currentMapTiles={currentMapTiles}
                        mapTiles={mapTiles}
                        mapHeight={mapHeight}
                        mapWidth={mapWidth}
                        index={index}
                    // imgSrc={currentMapTiles[index]}/>
                    />
                ))}
            </Grid>
        </Box>
    );
}
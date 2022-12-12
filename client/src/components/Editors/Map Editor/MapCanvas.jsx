import React from "react";
import { Box, Stack } from "@mui/system";
import { Modal, Typography, Button, Tabs, Tab, Grid } from "@mui/material";
import { Undo, Redo, Delete } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useState, useContext, useEffect } from "react";
import { GlobalStoreContext } from "../../../store/store";
import AuthContext from "../../../auth/auth";
import MapTile from "./MapTile";
import Viewport from "./Viewport";

export default function MapCanvas() {

	// Map Editor Code Start

	const { store } = useContext(GlobalStoreContext);
	const { auth } = useContext(AuthContext);

	const [mapHeight, setMapHeight] = useState(
		store.currentProject ? store.currentProject.mapHeight : 0
	);
	const [mapWidth, setMapWidth] = useState(
		store.currentProject ? store.currentProject.mapWidth : 0
	);
	const [currentMapTiles, setCurrentMapTiles] = useState(
		store.currentMapTiles
	);
	const [tilesets, setTilesets] = useState(store.mapTilesets);
	const [tileImages, setTileImages] = useState(
		store.mapTiles
			? store.mapTiles.map(function (tile) {
					return tile.tileImage;
			  })
			: []
	);
	const [currentIndices, setCurrentIndices] = useState([
		0,
		store.mapTilesets.length > 0 ? store.mapTilesets[0].tiles.length : 0,
	]);

	const [value, setValue] = useState(0);
	const [renderHeightRatio, setRenderHeightRatio] = useState(
		mapHeight / Math.max(mapHeight, mapWidth)
	);
	const [renderWidthRatio, setRenderWidthRatio] = useState(
		mapWidth / Math.max(mapHeight, mapWidth)
	);
	const [currentTile, setCurrentTile] = useState([0, 0]);
	const [openDeleteTilesetError, setOpenDeleteTilesetError] = useState(false);
  	const [ redoColor, setRedoColor ] = useState(store.canRedo ? '#2dd4cf' : '#1f293a')
  	const [ undoColor, setUndoColor ] = useState(store.canUndo ? '#2dd4cf' : '#1f293a')

	// useEffect(() => {
	auth.socket.on("recieveUpdateMap", (data) => {
		if (auth.socket.id === data.socketId) { 
			if (data.force) {

			}
			else {
				return; 
			}
		}

		store.loadMap(data.project).then(() => {

		});
	});
	// }, [])

	useEffect(() => {
		setMapHeight(store.currentProject ? store.currentProject.mapHeight : 0);
		setMapWidth(store.currentProject ? store.currentProject.mapWidth : 0);
		setCurrentMapTiles(store.currentMapTiles);
		console.log(store.currentMapTiles);
	}, [store.currentProject]);

	// updating map tilesets
	useEffect(() => {
		setTilesets(store.mapTilesets);
		setTileImages(
			store.mapTiles.map(function (tile) {
				return tile.tileImage;
			})
		);
		setCurrentIndices([
			0,
			store.mapTilesets.length > 0
				? store.mapTilesets[0].tiles.length
				: 0,
		]);
	}, [store.mapTilesets]);

  
  useEffect(() => {
        setUndoColor(store.canUndo ? '#2dd4cf' : '#1f293a')
        setRedoColor(store.canRedo ? '#2dd4cf' : '#1f293a')
  }, [store.canUndo, store.canRedo])

	const fillHelper = async (x, y, originalTile) => {
		let map = currentMapTiles;
		if (
			x < 0 ||
			x >= mapHeight ||
			y < 0 ||
			y >= mapWidth ||
			map[x * mapWidth + y] !== originalTile
		) {
			return;
		}
		if (map[x * mapWidth + y] === originalTile) {
			map[x * mapWidth + y] = store.primaryTile;
			fillHelper(x - 1, y, originalTile);
			fillHelper(x + 1, y, originalTile);
			fillHelper(x, y + 1, originalTile);
			fillHelper(x, y - 1, originalTile);
			await store.setCurrentMapTiles(map);
		}

	};
  
  const undo = async () => {
      if (store.currentStackIndex > -1) {
          let mapTiles = store.transactionStack[store.currentStackIndex].old
          console.log(mapTiles)
          await store.setCurrentMapTiles(mapTiles, false, true)
        //   store.undo()
          auth.socket.emit("updateMap", { project: store.currentProject._id });
      }
  }

  const redo = async () => {
      if (store.currentStackIndex < store.transactionStack.length - 1) {
          let mapTiles = store.transactionStack[store.currentStackIndex + 1].new
          console.log(mapTiles)
          await store.setCurrentMapTiles(mapTiles, true, false)
        //   await store.redo()
          auth.socket.emit("updateMap", { project: store.currentProject._id });
      }
  }

	const handleBucket = async () => {
		let originalTile =
			currentMapTiles[currentTile[0] * mapWidth + currentTile[1]];
		await fillHelper(currentTile[0], currentTile[1], originalTile);
		console.log("handling bucket now");
		auth.socket.emit("updateMap", { project: store.currentProject._id });
	};

	const handleClickTileOption = (e) => {
		let id = Number(e.currentTarget.id.replace("tile_option_", ""));
		store.setPrimaryTile(id);
		setMapHeight(mapHeight);
	};

	const handleHoverTile = (e) => {
		let id = Number(e.currentTarget.id.slice(5));
		let x = Math.floor(id / mapWidth);
		let y = id % mapWidth;
		setCurrentTile([x, y]);
	};

	// Map Editor Code End

	const handleChange = (event, newValue) => {
		console.log("value changed...");
		// get next tileset!
		setValue(newValue);
		let startIndex = 0;
		for (let i = 0; i < newValue; i++) {
			startIndex += tilesets[i].tiles.length;
		}
		let endIndex = startIndex + tilesets[newValue].tiles.length;
		setCurrentIndices([startIndex, endIndex]);
	};

	const handleOpenDeleteTilesetError = () => {
		setOpenDeleteTilesetError(true);
	};

	const handleCloseDeleteTilesetError = () => {
		setOpenDeleteTilesetError(false);
	};

	const deleteTileset = () => {
		// get tile indexes of tileset
		let startIndex = 0;
		let endIndex = 0;
		for (let i = 0; i < tilesets.length; i++) {
			if (tilesets[i] === tilesets[value]) {
				endIndex = startIndex + tilesets[i].tiles.length - 1;
				break;
			} else {
				startIndex += tilesets[i].tiles.length;
			}
		}

		let error = false;
		currentMapTiles.forEach((index) => {
			if (index >= startIndex && index <= endIndex) {
				//console.log("in use haha!");
				error = true;
				handleOpenDeleteTilesetError();
				return;
			}
		});

		if (error == true) {
			return;
		}

		store.deleteTilesetFromMap(tilesets[value]._id);
		setValue(0);
	};

	const StyledTab = styled(Tab)({
		"&.Mui-selected": {
			color: "#2dd4cf",
		},
	});

	return (
		<Box className="canvas_container" bgcolor={"#1f293a"} flex={10}>
			<Typography variant="h5" id="cursor_coord" color="azure">
				{currentTile[0] + ", " + currentTile[1]}
			</Typography>
    
          
			<Button onClick={undo} id='map_undo_button' sx={{ minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px' }}>
          <Undo style={{color: undoColor}} className='toolbar_mui_icon' />
      </Button>
      <Button onClick={redo} id='map_redo_button' sx={{ minHeight: '40px', minWidth: '40px', maxHeight: '40px', maxWidth: '40px' }}>
          <Redo style={{color: redoColor}} className='toolbar_mui_icon' />
      </Button>

			<Viewport
				map={store.currentProject}
				mapId={store.currentProject?._id}
				setCurrentTile={setCurrentTile}
				currentTile={currentTile}
			/>

			<Box bgcolor="#11182a" className="palettes_container">
				{tilesets.length > 0 ? (
					<Grid container>
						<Grid item xs={11}>
							<Box
								sx={{ borderBottom: 1, borderColor: "divider" }}
							>
								<Tabs
									value={value}
									onChange={handleChange}
									centered
									TabIndicatorProps={{
										style: { backgroundColor: "#2dd4cf" },
									}}
									sx={{
										"& .MuiTab-root": { color: "azure" },
									}}
								>
									{tilesets.map((tileset, index) => (
										<StyledTab label={tileset.title} />
									))}
								</Tabs>
							</Box>
						</Grid>
						<Grid item xs={1}>
							{tilesets.length > 0 ? (
								<Button
									onClick={deleteTileset}
									className="tileset_option_delete"
								>
									<Delete
										style={{
											color: "azure",
											fontSize: "25px",
										}}
									/>
								</Button>
							) : (
								<></>
							)}
						</Grid>
					</Grid>
				) : (
					<Box sx={{ textAlign: "center", marginTop: "40px" }}>
						<Typography sx={{ fontSize: "25px" }} color="azure">
							Import Tilesets to start working!
						</Typography>
					</Box>
				)}
				<Box sx={{ padding: 2 }}>
					<Stack style={{display: 'flex', flexDirection: 'row', overflowX: 'scroll'}} direction="row" spacing={2}>
						{/* {console.log("store map tiles")}
                        {console.log(store.mapTiles)} */}
						{
							// tileImages.slice(currentIndices[0], currentIndices[1]).map((image, index) => (
							//     <img onClick={handleClickTileOption} src={image} className='palette_option' />
							// ))
							store.mapTiles.map((image, index) =>
								index >= currentIndices[0] &&
								index < currentIndices[1] ? (
									<img style={{flexShrink: '0'}}
										onClick={handleClickTileOption}
										src={store.mapTiles[index].tileImage}
										id={`tile_option_${index}`}
										className="palette_option"
									/>
								) : null
							)
						}
					</Stack>
				</Box>
			</Box>

			<Modal
				open={openDeleteTilesetError}
				onClose={handleCloseDeleteTilesetError}
			>
				<Box
					borderRadius="10px"
					padding="20px"
					bgcolor="#11182a"
					position="absolute"
					top="40%"
					left="40%"
				>
					<Stack direction="column" style={{ margin: "10px" }}>
						<Typography
							style={{
								textAlign: "center",
								marginBottom: "10px",
							}}
							variant="h5"
							color="#2dd4cf"
						>
							Warning
						</Typography>
						<Typography
							style={{ textAlign: "center" }}
							color="azure"
						>
							Cannot Delete Tileset in use!
						</Typography>
					</Stack>
				</Box>
			</Modal>
		</Box>
	);
}

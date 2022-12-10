import { useState, useContext, useEffect } from "react";
import { GlobalStoreContext } from "../../../store/store";
import AuthContext from "../../../auth/auth";
import { Grid } from "@mui/material";

import MapTile from "./MapTile";
/**
 * Creates a viewport for the map editor
 * @param {props} props will contain only the map id
 */
export default function Viewport(props) {
	const { store } = useContext(GlobalStoreContext);
	const { auth } = useContext(AuthContext);
	const [viewport, setViewport] = useState([]);
	const [tilesets, setTilesets] = useState([]);
	const [startingPoint, setStartingPoint] = useState({
		x: 0,
		y: 0,
		indices: [],
	});
    const [mapWidth, setMapWidth] = useState(1);
    const [mapHeight, setMapHeight] = useState(1);
	const [viewportWidth, setViewportWidth] = useState(32); // max width of 32
	const [viewportHeight, setViewportHeight] = useState(32); // max height of 32
	const [renderWidthRatio, setRenderWidthRatio] = useState(1);
	const [renderHeightRatio, setRenderHeightRatio] = useState(1);

	useEffect(() => {
		createMapViewport(props.mapId).then((view) => {
			setViewport(view.tiles);
			console.log(view.map.mapWidth);
			setViewportWidth(view.width);
			setStartingPoint({
				x: view.start.x,
				y: view.start.y,
				indices: view.trueIndices,
			});
            setMapWidth(view.map.mapWidth);
            setMapHeight(view.map.mapHeight);
			setViewportHeight(view.height);
			setTilesets(view.tilesets);
			setRenderWidthRatio(view.width / Math.max(view.width, view.height));
			setRenderHeightRatio(
				view.height / Math.max(view.width, view.height)
			);
			console.log("Viewport created");
		});
	}, []);

	const updateSrc = async (index, value) => {
		viewport[index] = value;
        console.log('updating viewport')
		setViewport(viewport);
        await updateMapInDatabase();
	};

	const updateMapInDatabase = async () => {
        console.log('updating map in database')
		let map = await store.loadMap(props.mapId, true);
		let oldTiles = map.currentProject.tiles;
		for (let i = 0; i < startingPoint.indices.length; i++) {
			oldTiles[startingPoint.indices[i]] = viewport[i];
		}
		await store.updateMapToViewport(props.mapId, oldTiles);
        console.log('map updated in database')
	};

	const fillHelper = async (x, y, originalTile) => {
		let map = viewport;
		if (
			x < 0 ||
			x >= viewportHeight ||
			y < 0 ||
			y >= viewportWidth ||
			map[x * viewportWidth + y] !== originalTile
		) {
			return;
		}
		if (map[x * viewportWidth + y] === originalTile) {
			map[x * viewportWidth + y] = store.primaryTile;
			fillHelper(x - 1, y, originalTile);
			fillHelper(x + 1, y, originalTile);
			fillHelper(x, y + 1, originalTile);
			fillHelper(x, y - 1, originalTile);
			// await store.setCurrentMapTiles(map);
			return map;
		}
	};
	const updateCurrentMapTiles = async (value, index) => {
		let mapTiles = viewport;
		mapTiles[index] = value;
		console.log(mapTiles);
		await store.setCurrentMapTiles(mapTiles);
		auth.socket.emit("updateMap", { project: store.currentProject._id });
	};
	const handleHoverTile = (e) => {
		let id = Number(e.currentTarget.id.slice(5));
        console.log(mapWidth)
		let x = Math.floor(id / mapWidth);
		let y = (id % viewportWidth) + startingPoint.y;
        props.setCurrentTile([x,y])
	};
	const handleBucket = async () => {
		let originalTile =
			viewport[
				startingPoint.x * viewportWidth + startingPoint.y
			];
		let newMap = await fillHelper(
			startingPoint.x,
			startingPoint.y,
			originalTile
		);
		console.log(Object.values(startingPoint.indices));
		console.log("handling bucket now");
		setViewport(newMap);
		await updateMapInDatabase();
		auth.socket.emit("updateMap", { project: store.currentProject._id });
	};
	const createMapViewport = async () => {
		const mapId = props.mapId;
		const view = await store.initializeViewportOfMap(mapId);
		return view;
	};

	const moveViewportLeft = () => {};

	const moveViewportRight = () => {};

	const moveViewportUp = () => {};

	const moveViewportDown = () => {};

	const moveViewport = (direction) => {};

	return (
		<Grid
			container
			direction="row"
			rowSpacing={0}
			columns={viewportWidth}
			bgcolor="#000000"
			style={{
				position: "absolute",
				height: `${70 * renderHeightRatio}vh`,
				width: `${70 * renderWidthRatio}vh`,
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -60%)",
			}}
		>
			{viewport && viewport?.length > 0 &&
				viewport.map((tile, index) => (
					<MapTile
						handleBucket={handleBucket}
						updateCurrentMapTiles={updateCurrentMapTiles}
						mapHeight={viewportHeight}
						mapWidth={viewportWidth}
						index={startingPoint.indices[index]}
						handleHoverTile={handleHoverTile}
						imgSrc={tilesets[tile]}
						setSrc={async (value) => await updateSrc(index, value)}
					/>
				))}
		</Grid>
	);
}

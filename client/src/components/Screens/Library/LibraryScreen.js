import React from 'react';
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PublicIcon from '@mui/icons-material/Public';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { useState, useContext } from 'react'
import './css/library.css';
// import LibraryItem from './LibraryItem'
import GlobalStoreContext from '../../../store/store';

export default function LibraryScreen() {

    const [ maps, setMaps ] = useState([
        {
            mapName: "A",
            mapDescription: "Hard coded map description",
            tags: ["Adventure", "2D"],
            mapBackgroundColor: "#ffffff",
            mapHeight: 64,
            mapWidth: 10,
            tileHeight: 16,
            tileWidth: 24,
            tiles: [],
            tilesets: [],
            ownerId: '12898398193819',
            collaboratorIds: [],
            isPublic: false,
            layers: [],
            likes: ['1','1'],
            dislikes: ['1'],
            favs: 13,
            downloads: 1,
            comments: [],
            creationDate: '1667780097206'
        },
        {
            mapName: "B",
            mapDescription: "Hard coded map description 2",
            tags: ["Adventure", "2D"],
            mapBackgroundColor: "#ffffff",
            mapHeight: 64,
            mapWidth: 20,
            tileHeight: 16,
            tileWidth: 24,
            tiles: [],
            tilesets: [],
            ownerId: '98391829839131',
            collaboratorIds: [],
            isPublic: true,
            layers: [],
            likes: ['1', '2', '3', '4'],
            dislikes: ['1'],
            favs: 10,
            downloads: 29,
            comments: [],
            creationDate: '1667780097100'
        },
        {
            mapName: "C",
            mapDescription: "Hard coded map description 3",
            tags: ["Adventure", "2D"],
            mapBackgroundColor: "#ffffff",
            mapHeight: 64,
            mapWidth: 40,
            tileHeight: 16,
            tileWidth: 24,
            tiles: [],
            tilesets: [],
            ownerId: '793892129891911',
            collaboratorIds: [],
            isPublic: false,
            layers: [],
            likes: ['','','','','','','','','',''],
            dislikes: ['','','','','','','','','','','',''],
            favs: 0,
            downloads: 0,
            comments: [],
            creationDate: '1667729497206'
        },
        {
            mapName: "D",
            mapDescription: "Hard coded map description 3",
            tags: ["Adventure", "2D"],
            mapBackgroundColor: "#ffffff",
            mapHeight: 64,
            mapWidth: 96,
            tileHeight: 16,
            tileWidth: 24,
            tiles: [],
            tilesets: [],
            ownerId: '793892129891911',
            collaboratorIds: [],
            isPublic: false,
            layers: [],
            likes: ['', '','','','','','','','','','','','','','','',''],
            dislikes: [' '],
            favs: 0,
            downloads: 0,
            comments: [],
            creationDate: '1632780097206'
        }
    ])

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [sortOption, setSortOption] = useState("");
    const [sortDirection, setSortDirection] = useState("")
    const isSortMenuOpen = Boolean(anchorEl);
    const isFilterMenuOpen = Boolean(anchorEl2);
    const { store } = useContext(GlobalStoreContext);

    const userMaps = store.loadAllUserMaps('6366fec85d6527b3ccb9b547')
    console.log(userMaps)

    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setAnchorEl(null);
    };

    const handleFilterMenuOpen = (event) => {
        setAnchorEl2(event.currentTarget);
    };

    const handleFilterMenuClose = () => {
        setAnchorEl2(null);
    };

    const handleSortByNameClick = () => {
        if (sortOption !== "name") {
            setSortOption("name");
            setSortDirection("up");
            sortMaps("name", "up")
        }
        else {
            if (sortDirection === "up") {
                setSortDirection("down");
                sortMaps("name", "down")
            }
            else {
                setSortDirection("")
                setSortOption("")
            }
        }
    }

    const handleSortByCreationDateClick = () => {
        if (sortOption !== "date") {
            setSortOption("date");
            setSortDirection("up");
            sortMaps("date", "up")
        }
        else {
            if (sortDirection === "up") {
                setSortDirection("down");
                sortMaps("date", "down")
            }
            else {
                setSortDirection("")
                setSortOption("")
            }
        }
    }

    const handleSortByMostPopularClick = () => {
        if (sortOption !== "popularity") {
            setSortOption("popularity");
            setSortDirection("up");
            sortMaps("popular", "up")
        }
        else {
            if (sortDirection === "up") {
                setSortDirection("down");
                sortMaps("popular", "down")
            }
            else {
                setSortDirection("")
                setSortOption("")
            }
        }
    }

    const handleSortByMostLikedClick = () => {
        if (sortOption !== "liked") {
            setSortOption("liked");
            setSortDirection("up");
            sortMaps("liked", "up")
        }
        else {
            if (sortDirection === "up") {
                setSortDirection("down");
                sortMaps("liked", "down")
            }
            else {
                setSortDirection("")
                setSortOption("")
            }
        }
    }

    const handleSortBySizeClick = () => {
        if (sortOption !== "size") {
            setSortOption("size");
            setSortDirection("up");
            sortMaps("size", "up")
        }
        else {
            if (sortDirection === "up") {
                setSortDirection("down");
                sortMaps("size", "down")
            }
            else {
                setSortDirection("")
                setSortOption("")
            }
        }
    }

    const handleSortByCreatorNameClick = () => {
        if (sortOption !== "creator") {
            setSortOption("creator");
            setSortDirection("up");
        }
        else {
            if (sortDirection === "up") {
                setSortDirection("down");
            }
            else {
                setSortDirection("")
                setSortOption("")
            }
        }
    }

    const id = '6366fec85d6527b3ccb9b547';
    // const maps = store.userMaps;

    const sortMaps = (sortOpt, sortDir) => {
        switch(sortOpt) {
            case 'name':
                if (sortDir === "up") {
                    maps.sort((map1, map2) => {
                        return map1.mapName.localeCompare(map2.mapName);
                    });
                    return maps;
                }
                else {
                    maps.sort((map1, map2) => {
                        return -1 * map1.mapName.localeCompare(map2.mapName);
                    });
                    return maps;
                }
            case 'date':
                if (sortDir === "up") {
                    maps.sort((map1, map2) => {
                        let date1 = new Date(map1.creationDate)
                        let date2 = new Date(map2.creationDate)
                        return date2.getTime() - date1.getTime()    
                    });
                    console.log(maps)
                    return maps;
                }
                else {
                    maps.sort((map1, map2) => {
                        let date1 = new Date(map1.creationDate)
                        let date2 = new Date(map2.creationDate)
                        return date1.getTime() - date2.getTime()
                    });
                    console.log(maps)
                    return maps;
                }
            case 'popular':
                if (sortDir === 'up') {
                    maps.sort((map1, map2) => {
                        if (map2.dislikes.length === 0) {
                            return 1;
                        }
                        if (map1.dislikes.length === 0) {
                            return -1;
                        }
                        let p1 = map1.likes.length / map1.dislikes.length
                        let p2 = map2.likes.length / map2.dislikes.length
                        return p2 - p1;
                    })
                    console.log(maps)
                    return maps
                }
                else {
                    maps.sort((map1, map2) => {
                        if (map2.dislikes.length === 0) {
                            return -1;
                        }
                        if (map1.dislikes.length === 0) {
                            return 1;
                        }
                        let p1 = map1.likes.length / map1.dislikes.length
                        let p2 = map2.likes.length / map2.dislikes.length
                        return p1 - p2;
                    })
                    console.log(maps)
                    return maps
                }
            case 'liked':
                if (sortDir === "up") {
                    maps.sort((map1, map2) => {
                        return map2.likes.length - map1.likes.length;  
                    });
                    console.log(maps)
                    return maps;
                }
                else {
                    maps.sort((map1, map2) => {
                        return map1.likes.length - map2.likes.length;  
                    });
                    console.log(maps)
                    return maps;
                }
            case 'size':
                if (sortDir === "up") {
                    maps.sort((map1, map2) => {
                        return (map1.mapWidth * map1.mapHeight) - (map2.mapWidth * map2.mapHeight)  
                    });
                    console.log(maps)
                    return maps;
                }
                else {
                    maps.sort((map1, map2) => {
                        return (map2.mapWidth * map2.mapHeight) - (map1.mapWidth * map1.mapHeight)  
                    });
                    console.log(maps)
                    return maps;
                }
        }
    }

    return (
        <Box
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                width: '100%',
                height: '100vh',
                backgroundColor: '#1f293a',
                padding: '20px'
            }}
        >

            <Box>
                <Button onClick={handleSortMenuOpen}
                    style={{ backgroundColor: "#333135", marginLeft: "30px", marginTop: "10px", marginBottom: "20px" }}
                >
                    <div className="button_text">Sort by</div>
                    <SortIcon className="button_icons"></SortIcon>
                </Button>
                <Button onClick={handleFilterMenuOpen}
                    style={{ backgroundColor: "#333135", marginLeft: "30px", marginTop: "10px", marginBottom: "20px" }}
                >
                    <div className="button_text">Filter by</div>
                    <SortIcon className="button_icons" ></SortIcon>
                </Button>
            </Box>


            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                className='sort_filter_dropdown'
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isSortMenuOpen}
                onClose={handleSortMenuClose}
            >
                { sortOption === 'name' 
                    ? sortDirection === 'up' 
                        ? <MenuItem onClick={handleSortByNameClick}>Project Name <ArrowUpward/></MenuItem>
                        : <MenuItem onClick={handleSortByNameClick}>Project Name <ArrowDownward/></MenuItem>
                    : <MenuItem onClick={handleSortByNameClick}>Project Name</MenuItem>
                }
                { sortOption === 'date' 
                    ? sortDirection === 'up' 
                        ? <MenuItem onClick={handleSortByCreationDateClick}>Creation Date <ArrowUpward/></MenuItem>
                        : <MenuItem onClick={handleSortByCreationDateClick}>Creation Date <ArrowDownward/></MenuItem>
                    : <MenuItem onClick={handleSortByCreationDateClick}>Creation Date</MenuItem>
                }
                { sortOption === 'popularity' 
                    ? sortDirection === 'up' 
                        ? <MenuItem onClick={handleSortByMostPopularClick}>Popularity <ArrowUpward/></MenuItem>
                        : <MenuItem onClick={handleSortByMostPopularClick}>Popularity <ArrowDownward/></MenuItem>
                    : <MenuItem onClick={handleSortByMostPopularClick}>Popularity</MenuItem>
                }
                { sortOption === 'liked' 
                    ? sortDirection === 'up' 
                        ? <MenuItem onClick={handleSortByMostLikedClick}>Most Liked <ArrowUpward/></MenuItem>
                        : <MenuItem onClick={handleSortByMostLikedClick}>Most Liked<ArrowDownward/></MenuItem>
                    : <MenuItem onClick={handleSortByMostLikedClick}>Most Liked</MenuItem>
                }
                { sortOption === 'size' 
                    ? sortDirection === 'up' 
                        ? <MenuItem onClick={handleSortBySizeClick}>Size <ArrowUpward/></MenuItem>
                        : <MenuItem onClick={handleSortBySizeClick}>Size <ArrowDownward/></MenuItem>
                    : <MenuItem onClick={handleSortBySizeClick}>Size</MenuItem>
                }
                { sortOption === 'creator' 
                    ? sortDirection === 'up' 
                        ? <MenuItem onClick={handleSortByCreatorNameClick}>Creator Name <ArrowUpward/></MenuItem>
                        : <MenuItem onClick={handleSortByCreatorNameClick}>Creator Name <ArrowDownward/></MenuItem>
                    : <MenuItem onClick={handleSortByCreatorNameClick}>Creator Name</MenuItem>
                }
            </Menu>

            <Menu
                anchorEl={anchorEl2}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                className='sort_filter_dropdown'
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isFilterMenuOpen}
                onClose={handleFilterMenuClose}
            >
                <MenuItem>Rating</MenuItem>
                <MenuItem>Size</MenuItem>
                <MenuItem>Tags</MenuItem>
                <MenuItem>Owned</MenuItem>
                <MenuItem>Shared</MenuItem>
            </Menu>

            <Box height="20px"></Box>

            <Box
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    maxHeight: '100%',
                    width: '100%',
                    overflow: 'auto'
                }}
            >

                {maps && maps.map((project) => (
                    <Box id={project._id} sx={{ marginLeft:"20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius:"16px" }} style={{marginBottom: "60px", width: '25%', height: '78%', position: 'relative' }}>
                        <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                        { project.isPublic 
                            ? <LockIcon className='library_lock_icon'></LockIcon>
                            : <LockOpenIcon className='library_lock_icon'></LockOpenIcon>
                        }
                        <div className="library_overlay">
                            <Box style={{ display: 'flex', flexDirection: 'row' }} >
                                <Box style={{ width:'50%', display: 'flex', flexDirection: 'column' }} >
                                    <div className="library_project_title">{project.mapName}</div>
                                    <div className="library_project_author">by @{project.ownerId}</div>
                                </Box>
                                <Box style={{ width: '50%', paddingLeft: '70px', paddingRight:'20px', paddingTop:"10px", display: 'flex', alignItems: 'center', justifyContent:'end', flexDirection: 'row' }} >
                                    <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                                    <FavoriteIcon sx={{ fontSize: 20, px: 1, color: 'cyan' }}></FavoriteIcon>
                                    <EditIcon sx={{ fontSize: 20, color: 'gray' }}></EditIcon>
                                </Box>
                            </Box>
                        </div>
                    </Box>
                ))}

                {/* <Box sx={{ marginLeft:"20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius:"16px" }} style={{marginBottom: "60px", width: '25%', height: '78%', position: 'relative' }}>
                    <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                    <LockIcon className='library_lock_icon'></LockIcon>
                    <div className="library_overlay">
                        <Box style={{ display: 'flex', flexDirection: 'row' }} >
                            <Box style={{ width:'50%', display: 'flex', flexDirection: 'column' }} >
                                <div className="library_project_title">Planet Midget</div>
                                <div className="library_project_author">by @tomJackson16</div>
                            </Box>
                            <Box style={{ width: '50%', paddingLeft: '70px', paddingRight:'20px', paddingTop:"10px", display: 'flex', alignItems: 'center', justifyContent:'end', flexDirection: 'row' }} >
                                <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                                <FavoriteIcon sx={{ fontSize: 20, px: 1, color: 'cyan' }}></FavoriteIcon>
                                <EditIcon sx={{ fontSize: 20, color: 'gray' }}></EditIcon>
                            </Box>
                        </Box>
                    </div>
                </Box>
                <Box sx={{ marginLeft:"20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius:"16px" }} style={{marginBottom: "60px", width: '25%', height: '78%', position: 'relative' }}>
                    <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                    <LockIcon className='library_lock_icon'></LockIcon>
                    <div className="library_overlay">
                        <Box style={{ display: 'flex', flexDirection: 'row' }} >
                            <Box style={{ width:'50%', display: 'flex', flexDirection: 'column' }} >
                                <div className="library_project_title">Planet Midget Copy</div>
                                <div className="library_project_author">by You</div>
                            </Box>
                            <Box style={{ width: '50%', paddingRight:'20px', paddingTop:"10px", display: 'flex', alignItems: 'center', justifyContent:'end  ', flexDirection: 'row' }} >
                                <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                                <PublicIcon sx={{ fontSize: 20, px: 1, color: 'cyan' }}></PublicIcon>
                                <EditIcon sx={{ fontSize: 20 }}></EditIcon>
                            </Box>
                        </Box>
                    </div>
                </Box>
                <Box sx={{ marginLeft:"20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius:"16px" }} style={{marginBottom: "60px", width: '25%', height: '78%', position: 'relative' }}>
                    <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                    <LockOpenIcon className='library_lock_icon'></LockOpenIcon>
                    <div className="library_overlay">
                        <Box style={{ display: 'flex', flexDirection: 'row' }} >
                            <Box style={{ width:'50%', display: 'flex', flexDirection: 'column' }} >
                                <div className="library_project_title">Planet Midget Public</div>
                                <div className="library_project_author">@tomJackson16</div>
                            </Box>
                            <Box style={{ width: '50%', paddingRight:'20px', paddingTop:"10px", display: 'flex', alignItems: 'center', justifyContent:'end  ', flexDirection: 'row' }} >
                                <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                                <FavoriteIcon sx={{ fontSize: 20, px: 1, color: 'cyan' }}></FavoriteIcon>
                                <EditIcon sx={{ fontSize: 20 }}></EditIcon>
                            </Box>
                        </Box>
                    </div>
                </Box> */}
                
            </Box>
        </Box>
    )
}
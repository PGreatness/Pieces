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
import { useState, useContext, useEffect } from 'react'
import './css/library.css';
// import LibraryItem from './LibraryItem'
import GlobalStoreContext from '../../../store/store';
import AuthContext from '../../../auth/auth';

export default function LibraryScreen() {

    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        store.loadUserAndCollabMaps("6357194e0a81cb803bbb913e")
    }, [auth])

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const [sortOption, setSortOption] = useState("");
    const [sortDirection, setSortDirection] = useState("")
    const [filterOptions, setFilterOptions] = useState([])
    const [allMaps, setAllMaps] = useState()
    const isSortMenuOpen = Boolean(anchorEl);
    const isFilterMenuOpen = Boolean(anchorEl2);

    //console.log("ALL MAPS")
    //console.log(store.userMaps)
    //console.log(allMaps)

    useEffect(() => {
        store.setLibrarySort(sortOption, sortDirection);
    }, [sortOption, sortDirection])

    useEffect(() => {
        setAllMaps(store.userMaps.concat(store.collabMaps))
    }, [store.userMaps])

    // setAllMaps(store.userMaps.concat(store.collabMaps))

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
        }
        else {
            if (sortDirection === "up") {
                setSortDirection("down");
            }
            else {
                setSortOption("name");
                setSortDirection("up");
            }
        }
    }

    const handleSortByCreationDateClick = () => {
        if (sortOption !== "date") {
            setSortOption("date");
            setSortDirection("up");
        }
        else {
            if (sortDirection === "up") {
                setSortDirection("down");
            }
            else {
                setSortOption("name");
                setSortDirection("up");
            }
        }
    }

    const handleSortByMostPopularClick = () => {
        if (sortOption !== "popularity") {
            setSortOption("popularity");
            setSortDirection("up");
        }
        else {
            if (sortDirection === "up") {
                setSortDirection("down");
            }
            else {
                setSortOption("name");
                setSortDirection("up");
            }
        }
    }

    const handleSortByMostLikedClick = () => {
        if (sortOption !== "liked") {
            setSortOption("liked");
            setSortDirection("up");
        }
        else {
            if (sortDirection === "up") {
                setSortDirection("down");
            }
            else {
                setSortOption("name");
                setSortDirection("up");
            }
        }
    }

    const handleSortBySizeClick = () => {
        if (sortOption !== "size") {
            setSortOption("size");
            setSortDirection("up");
        }
        else {
            if (sortDirection === "up") {
                setSortDirection("down");
            }
            else {
                setSortOption("name");
                setSortDirection("up");
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
                setSortOption("name");
                setSortDirection("up");
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
                {sortOption === 'name'
                    ? sortDirection === 'up'
                        ? <MenuItem onClick={handleSortByNameClick}>Project Name <ArrowUpward /></MenuItem>
                        : <MenuItem onClick={handleSortByNameClick}>Project Name <ArrowDownward /></MenuItem>
                    : <MenuItem onClick={handleSortByNameClick}>Project Name</MenuItem>
                }
                {sortOption === 'date'
                    ? sortDirection === 'up'
                        ? <MenuItem onClick={handleSortByCreationDateClick}>Creation Date <ArrowUpward /></MenuItem>
                        : <MenuItem onClick={handleSortByCreationDateClick}>Creation Date <ArrowDownward /></MenuItem>
                    : <MenuItem onClick={handleSortByCreationDateClick}>Creation Date</MenuItem>
                }
                {/* {sortOption === 'popularity'
                    ? sortDirection === 'up'
                        ? <MenuItem onClick={handleSortByMostPopularClick}>Popularity <ArrowUpward /></MenuItem>
                        : <MenuItem onClick={handleSortByMostPopularClick}>Popularity <ArrowDownward /></MenuItem>
                    : <MenuItem onClick={handleSortByMostPopularClick}>Popularity</MenuItem>
                } */}
                {sortOption === 'liked'
                    ? sortDirection === 'up'
                        ? <MenuItem onClick={handleSortByMostLikedClick}>Most Liked <ArrowUpward /></MenuItem>
                        : <MenuItem onClick={handleSortByMostLikedClick}>Most Liked<ArrowDownward /></MenuItem>
                    : <MenuItem onClick={handleSortByMostLikedClick}>Most Liked</MenuItem>
                }
                {sortOption === 'size'
                    ? sortDirection === 'up'
                        ? <MenuItem onClick={handleSortBySizeClick}>Size <ArrowUpward /></MenuItem>
                        : <MenuItem onClick={handleSortBySizeClick}>Size <ArrowDownward /></MenuItem>
                    : <MenuItem onClick={handleSortBySizeClick}>Size</MenuItem>
                }
                {/* {sortOption === 'creator'
                    ? sortDirection === 'up'
                        ? <MenuItem onClick={handleSortByCreatorNameClick}>Creator Name <ArrowUpward /></MenuItem>
                        : <MenuItem onClick={handleSortByCreatorNameClick}>Creator Name <ArrowDownward /></MenuItem>
                    : <MenuItem onClick={handleSortByCreatorNameClick}>Creator Name</MenuItem>
                } */}
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
                    flexWrap: 'wrap',
                    maxWidth: '100%',
                    overflowX: "scroll"
                }}
            >

                {sortOption === ""
                    ? (allMaps && allMaps.map((project) => (
                        <Box id={project._id} sx={{ marginLeft: "20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius: "16px" }} style={{ marginBottom: "60px", width: '25%', height: '78%', position: 'relative' }}>
                            <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                            {project.isPublic
                                ? <LockIcon className='library_lock_icon'></LockIcon>
                                : <LockOpenIcon className='library_lock_icon'></LockOpenIcon>
                            }
                            <div className="library_overlay">
                                <Box style={{ display: 'flex', flexDirection: 'row' }} >
                                    <Box style={{ width: '50%', display: 'flex', flexDirection: 'column' }} >
                                        <div className="library_project_title">{project.mapName}</div>
                                        <div className="library_project_author">by @{project.ownerId}</div>
                                    </Box>
                                    <Box style={{ width: '50%', paddingLeft: '70px', paddingRight: '20px', paddingTop: "10px", display: 'flex', alignItems: 'center', justifyContent: 'end', flexDirection: 'row' }} >
                                        <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                                        <FavoriteIcon sx={{ fontSize: 20, px: 1, color: 'cyan' }}></FavoriteIcon>
                                        <EditIcon sx={{ fontSize: 20, color: 'gray' }}></EditIcon>
                                    </Box>
                                </Box>
                            </div>
                        </Box>
                    )))
                    : (store.sortedLibraryList && store.sortedLibraryList.map((project) => (
                        <Box id={project._id} sx={{ marginLeft: "20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius: "16px" }} style={{ marginBottom: "60px", width: '25%', height: '78%', position: 'relative' }}>
                            <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                            {project.isPublic
                                ? <LockIcon className='library_lock_icon'></LockIcon>
                                : <LockOpenIcon className='library_lock_icon'></LockOpenIcon>
                            }
                            <div className="library_overlay">
                                <Box style={{ display: 'flex', flexDirection: 'row' }} >
                                    <Box style={{ width: '50%', display: 'flex', flexDirection: 'column' }} >
                                        <div className="library_project_title">{project.mapName}</div>
                                        <div className="library_project_author">by @{project.ownerId}</div>
                                    </Box>
                                    <Box style={{ width: '50%', paddingLeft: '70px', paddingRight: '20px', paddingTop: "10px", display: 'flex', alignItems: 'center', justifyContent: 'end', flexDirection: 'row' }} >
                                        <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                                        <FavoriteIcon sx={{ fontSize: 20, px: 1, color: 'cyan' }}></FavoriteIcon>
                                        <EditIcon sx={{ fontSize: 20, color: 'gray' }}></EditIcon>
                                    </Box>
                                </Box>
                            </div>
                        </Box>
                    )))
                }

            </Box>
        </Box>
    )
}
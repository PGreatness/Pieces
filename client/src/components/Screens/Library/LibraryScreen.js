import React from 'react';
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Grid, Modal, Typography, Checkbox } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { useState, useContext, useEffect } from 'react'
import './css/library.css';
import GlobalStoreContext from '../../../store/store';
import AuthContext from '../../../auth/auth';
import { useNavigate } from 'react-router-dom';

export default function LibraryScreen(props) {
    const navigate = useNavigate();
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        store.loadUserAndCollabMaps("6357194e0a81cb803bbb913e")
    }, [auth])

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);

    const [sortOption, setSortOption] = useState("");
    const [sortDirection, setSortDirection] = useState("")

    const [filterOptions, setFilterOptions] = useState([0, 0])
    const [filterActive, setFilterActive] = useState(false)
    const [filteredMaps, setFilteredMaps] = useState()

    const [tagFilters, setTagFilters] = useState({
        'rpg_checkbox': true,
        'space_checkbox': true,
        'adventure_checkbox': true,
        'nature_checkbox': true,
        'shooter_checkbox': true,
        'arcade_checkbox': true
    })
    const [openTagsFilterModal, setOpenTagsFilterModal] = useState(false)

    const [allMaps, setAllMaps] = useState()

    const isSortMenuOpen = Boolean(anchorEl);
    const isFilterMenuOpen = Boolean(anchorEl2);

    useEffect(() => {
        store.setLibrarySort(sortOption, sortDirection);
    }, [sortOption, sortDirection])

    useEffect(() => {
        setAllMaps(store.userMaps.concat(store.collabMaps))
    }, [store.userMaps])

    useEffect(() => {
        if (filterActive) {
            setSortDirection("")
            setSortOption("")

            let maps = allMaps
            let filtered = []

            if (filterOptions[0] === 0 && filterOptions[1] === 0) {
                filtered = maps
            }
            else {
                // Filters by basic filters (check boxes)
                for (let i = 0; i < allMaps.length; i++) {
                    let map = maps[i]

                    // If map does not belong to user, remove
                    if (filterOptions[0] === 1) {
                        if (map.ownerId.toString() === "6357194e0a81cb803bbb913e") {
                            filtered.push(map)
                        }
                    }
                    // If map belongs to user, remove
                    else if (filterOptions[0] === -1) {
                        if (map.ownerId.toString() !== "6357194e0a81cb803bbb913e") {
                            filtered.push(map)
                        }
                    }

                    if (filterOptions[1] === 1) {
                        if (map.isPublic) {
                            filtered.push(map)
                        }
                    }
                    else if (filterOptions[1] === -1) {
                        if (!map.isPublic) {
                            filtered.push(map)
                        }
                    }
                }
            }

            setFilteredMaps(filtered)
        
        }
        else {
            setAllMaps(store.userMaps.concat(store.collabMaps))
        }
    }, [filterOptions])

    // useEffect(() => {
        
    //     console.log("You changed a tag!")
    //     var maps;
    //     if (!filterActive) {
    //         setAllMaps(store.userMaps.concat(store.collabMaps))
    //         setFilterActive(true)
    //     }
    //     else {
    //         maps = filteredMaps
    //     }

    //     console.log(maps)

    //     let tagsList = []
    //     for (const [key, val] of Object.entries(tagFilters)) {
    //         if (val) {
    //             tagsList.push(key.replace("_checkbox", ""))
    //         }
    //     }
    //     console.log(tagsList)
    //     if (tagsList.length === 6) {
    //         return
    //     }

    //     // let filtered = maps[0]
    //     // // for (let i = 0; i < maps.length; i++) {
    //     // //     console.log("")
    //     // // }
        
    //     // setFilteredMaps(filtered)
        
    // }, [tagFilters])


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

    const handleFilterOwnedClick = () => {
        if (filterOptions[0] === 0) {
            setFilterOptions([1, 0])
            setFilterActive(true)
        }
        else if (filterOptions[0] === 1) {
            setFilterOptions([-1, 0])
            setFilterActive(true)
        }
        else if (filterOptions[0] === -1) {
            setFilterOptions([0, 0])
            setFilterActive(false)
            setFilteredMaps(store.userMaps.concat(store.collabMaps))
        }
    }

    const handleFilterPublicClick = () => {
        if (filterOptions[1] === 0) {
            setFilterOptions([0, 1])
            setFilterActive(true)
        }
        else if (filterOptions[1] === 1) {
            setFilterOptions([0, -1])
            setFilterActive(true)
        }
        else if (filterOptions[1] === -1) {
            setFilterOptions([0, 0])
            setFilterActive(false)
            setFilteredMaps(store.userMaps.concat(store.collabMaps))
            console.log(store.userMaps)
        }
    }

    const handleOpenTagsFilterModal = () => {
        setOpenTagsFilterModal(true)
    }
    
    const handleCloseTagsFilterModal = () => {
        setOpenTagsFilterModal(false)
        setTagFilters({
            'rpg_checkbox': document.getElementById('rpg_checkbox').checked,
            'space_checkbox': document.getElementById('space_checkbox').checked,
            'adventure_checkbox': document.getElementById('adventure_checkbox').checked,
            'nature_checkbox': document.getElementById('nature_checkbox').checked,
            'shooter_checkbox': document.getElementById('shooter_checkbox').checked,
            'arcade_checkbox': document.getElementById('arcade_checkbox').checked
        })
    }

    const handleConfirmTagFilters = (e) => {
        console.log(e.target)
    }

    const handleTagOnChange = (e) => {
        // let id = e.target.id
        // let newFilter = tagFilters
        // newFilter[id] = e.target.checked
        // setFilterActive(true)
        // setTagFilters(newFilter)
    }

    const setLocation = (loc) => {
        props.setLoc(loc);
        navigate(loc);
    }

    return (
        <Box
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
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
                <MenuItem onClick={handleOpenTagsFilterModal}>Tags</MenuItem>
                {filterOptions[0] === 0
                    ? <MenuItem onClick={handleFilterOwnedClick}>Owned</MenuItem>
                    : filterOptions[0] === 1
                        ? <MenuItem onClick={handleFilterOwnedClick}>Owned <CheckIcon/></MenuItem>
                        : <MenuItem onClick={handleFilterOwnedClick}>Owned <ClearIcon/></MenuItem>
                }
                {filterOptions[1] === 0
                    ? <MenuItem onClick={handleFilterPublicClick}>Is Public</MenuItem>
                    : filterOptions[1] === 1
                        ? <MenuItem onClick={handleFilterPublicClick}>Is Public <CheckIcon/></MenuItem>
                        : <MenuItem onClick={handleFilterPublicClick}>Is Public <ClearIcon/></MenuItem>
                }
            </Menu>

            <Box height="20px"></Box>

            <Box
                style={{
                    display: 'flex',
                    //alignItems: 'center',
                    flexDirection: 'row',
                    height: '100vh',
                    width: '96%',
                    flexWrap: 'wrap',
                    maxWidth: '100%',
                    overflowX: "scroll",
                    marginBottom: '10px'
                }}
            >

                {sortOption === "" && !filterActive
                    ? (allMaps && allMaps.map((project) => (
                        <Box id={project._id} sx={{ marginLeft: "20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius: "16px" }} 
                        style={{ marginBottom: "60px", width: '25%', height: '40%', position: 'relative' }}
                        onClick={() => {setLocation('/map/1'); store.changePageToMapEditor()}}>
                            <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                            {project.collaboratorIds.includes(auth.user?._id) || project.ownerId == auth.user?._id
                                ? <LockIcon className='library_lock_icon'></LockIcon>
                                : <LockOpenIcon className='library_lock_icon'></LockOpenIcon>
                            }
                            <div className="library_overlay">
                                <Box style={{ display: 'flex', flexDirection: 'row' }} >
                                    <Box style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
                                        <div className="library_project_title">{project.title}</div>
                                        <div className="library_project_desc">{project.mapDescription}</div>
                                    </Box>                            
                                </Box>
                            </div>
                        </Box>
                    )))
                    : !filterActive
                        ? (store.sortedLibraryList && store.sortedLibraryList.map((project) => (
                            <Box id={project._id} sx={{ marginLeft: "20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius: "16px" }} style={{ marginBottom: "60px", width: '25%', height: '40%', position: 'relative' }}>
                                <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                                {project.collaboratorIds.includes(auth.user?._id) || project.ownerId == auth.user?._id
                                    ? <LockIcon className='library_lock_icon'></LockIcon>
                                    : <LockOpenIcon className='library_lock_icon'></LockOpenIcon>
                                }
                                <div className="library_overlay">
                                    <Box style={{ display: 'flex', flexDirection: 'row' }} >
                                        <Box style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
                                            <div className="library_project_title">{project.title}</div>
                                            <div className="library_project_author">by @{project.ownerId}</div>
                                        </Box>
                                    </Box>
                                </div>
                            </Box>
                        )))
                        : (filteredMaps && filteredMaps.map((project) => (
                            <Box id={project._id} sx={{ marginLeft: "20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius: "16px" }} style={{ marginBottom: "60px", width: '25%', height: '40%', position: 'relative' }}>
                                <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                                {project.collaboratorIds.includes(auth.user?._id) || project.ownerId == auth.user?._id
                                    ? <LockIcon className='library_lock_icon'></LockIcon>
                                    : <LockOpenIcon className='library_lock_icon'></LockOpenIcon>
                                }
                                <div className="library_overlay">
                                    <Box style={{ display: 'flex', flexDirection: 'row' }} >
                                        <Box style={{ width: '100%', display: 'flex', flexDirection: 'column' }} >
                                            <div className="library_project_title">{project.title}</div>
                                            <div className="library_project_author">by @{project.ownerId}</div>
                                        </Box>
                                    </Box>
                                </div>
                            </Box>
                        )))
                }

            </Box>

            <Modal
                open={openTagsFilterModal}
                onClose={handleCloseTagsFilterModal}
            >
                <Box borderRadius='10px' padding='20px' bgcolor='#11182a' position='absolute' width='50%' top='30%' left='30%'>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography style={{textAlign:'center', marginBottom:'5px'}} variant='h5' color='azure'>Tags Filter</Typography>
                        </Grid>
                        <Grid style={{display:'flex', justifyContent:'center', alignItems:'center'}} item xs={4}>
                            <Typography style={{textAlign:'center', marginBottom:'5px'}} color='azure'>RPG</Typography>
                            <Checkbox id='rpg_checkbox' onChange={handleTagOnChange} sx={{color:'azure'}} style={{contentAlign:'center'}} defaultChecked={tagFilters['rpg_checkbox']}></Checkbox>
                        </Grid>
                        <Grid style={{display:'flex', justifyContent:'center', alignItems:'center'}} item xs={4}>
                            <Typography style={{textAlign:'center', marginBottom:'5px'}} color='azure'>Adventure</Typography>
                            <Checkbox id='adventure_checkbox' onChange={handleTagOnChange} sx={{color:'azure'}} defaultChecked={tagFilters['adventure_checkbox']}></Checkbox>
                        </Grid>
                        <Grid style={{display:'flex', justifyContent:'center', alignItems:'center'}} item xs={4}>
                            <Typography style={{textAlign:'center', marginBottom:'5px'}} color='azure'>Space</Typography>
                            <Checkbox id='space_checkbox' onChange={handleTagOnChange} sx={{color:'azure'}} defaultChecked={tagFilters['space_checkbox']}></Checkbox>
                        </Grid>
                        <Grid style={{display:'flex', justifyContent:'center', alignItems:'center'}} item xs={4}>
                            <Typography style={{textAlign:'center', marginBottom:'5px'}} color='azure'>Nature</Typography>
                            <Checkbox id='nature_checkbox' onChange={handleTagOnChange} sx={{color:'azure'}} bgcolor='azure' defaultChecked={tagFilters['nature_checkbox']}></Checkbox>
                        </Grid>
                        <Grid style={{display:'flex', justifyContent:'center', alignItems:'center'}} item xs={4}>
                            <Typography style={{textAlign:'center', marginBottom:'5px'}} color='azure'>Shooter</Typography>
                            <Checkbox id='shooter_checkbox' onChange={handleTagOnChange} sx={{color:'azure'}} defaultChecked={tagFilters['shooter_checkbox']}></Checkbox>
                        </Grid>
                        <Grid style={{display:'flex', justifyContent:'center', alignItems:'center'}} item xs={4}>
                            <Typography style={{textAlign:'center', marginBottom:'5px'}} color='azure'>Arcade</Typography>
                            <Checkbox id='arcade_checkbox' onChange={handleTagOnChange} sx={{color:'azure'}} defaultChecked={tagFilters['arcade_checkbox']}></Checkbox>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={4}>
                            <Button>
                                Close
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button onClick={handleConfirmTagFilters}>
                                Confirm
                            </Button>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                </Box>
            </Modal>
        </Box>
    )
}
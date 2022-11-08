import * as React from 'react';
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';
import Box from '@mui/material/Box';
import ExploreMapItem from './ExploreMapItem'
import ExploreTilesetItem from './ExploreTilesetItem'
import MakePaginations from './MakePaginations';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import { useState, useContext } from 'react';
import { GlobalStoreContext } from '../../../store/store'
import AuthContext from '../../../auth/auth';

import './css/explore.css';

export default function Explore(props) {
    const [sortOpt, setSortOpt] = useState("");
    const [sortDir, setSortDir] = useState("")
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl2, setAnchorEl2] = useState(null);
    const isSortMenuOpen = Boolean(anchorEl);
    const isFilterMenuOpen = Boolean(anchorEl2);
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const projects = store.publicProjects
    //console.log(projects)

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

    const handleSortClick = (event) => {
        handleSortMenuClose();
        console.log(event.target.innerText)

        if (sortOpt != event.target.innerText) {
            console.log('setting now?')
            setSortOpt(event.target.innerText);
            setSortDir("up");
            store.changeExploreSort(event.target.innerText, "up");
        }
        else {
            if (sortDir === "up") {
                setSortDir("down");
                store.changeExploreSort(event.target.innerText, "down");
            }
            else {
                setSortDir("up");
                store.changeExploreSort(event.target.innerText, "up");
            }
        }

    }


    return (
        <Box style={{
            display: 'flex', alignItems: 'flex-start',
            flexDirection: 'column', width: '100%', padding: '20px'
        }}>

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
                {sortOpt === 'Project Name'
                    ? sortDir === 'up'
                        ? <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <MenuItem onClick={handleSortClick}>Project Name</MenuItem>
                            <ArrowUpward />
                        </Box>
                        : <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <MenuItem onClick={handleSortClick}>Project Name</MenuItem>
                            <ArrowDownward />
                        </Box>
                    : <MenuItem onClick={handleSortClick}>Project Name</MenuItem>
                }
                {sortOpt === 'Creation Date'
                    ? sortDir === 'up'
                        ? <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <MenuItem onClick={handleSortClick}>Creation Date</MenuItem>
                            <ArrowUpward />
                        </Box>
                        : <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <MenuItem onClick={handleSortClick}>Creation Date</MenuItem>
                            <ArrowDownward />
                        </Box>
                    : <MenuItem onClick={handleSortClick}>Creation Date</MenuItem>
                }
                {sortOpt === 'Most Downloaded'
                    ? sortDir === 'up'
                        ? <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <MenuItem onClick={handleSortClick}>Most Downloaded</MenuItem>
                            <ArrowUpward />
                        </Box>
                        : <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <MenuItem onClick={handleSortClick}>Most Downloaded</MenuItem>
                            <ArrowDownward />
                        </Box>
                    : <MenuItem onClick={handleSortClick}>Most Downloaded</MenuItem>
                }
                {sortOpt === 'Most Liked'
                    ? sortDir === 'up'
                        ? <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <MenuItem onClick={handleSortClick}>Most Liked</MenuItem>
                            <ArrowUpward />
                        </Box>
                        : <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <MenuItem onClick={handleSortClick}>Most Liked</MenuItem>
                            <ArrowDownward />
                        </Box>
                    : <MenuItem onClick={handleSortClick}>Most Liked</MenuItem>
                }
                {sortOpt === 'Size'
                    ? sortDir === 'up'
                        ? <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <MenuItem onClick={handleSortClick}>Size</MenuItem>
                            <ArrowUpward />
                        </Box>
                        : <Box style={{ display: 'flex', flexDirection: 'row' }}>
                            <MenuItem onClick={handleSortClick}>Size</MenuItem>
                            <ArrowDownward />
                        </Box>
                    : <MenuItem onClick={handleSortClick}>Size</MenuItem>
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


            <Box style={{
                display: 'flex', alignItems: 'flex-start', flexDirection: 'column', maxHeight: '100%',
                width: '100%', overflow: 'auto', paddingLeft: '10px', borderRadius: '30px'
            }}>
                {projects.map((entry) => (

                    entry.mapName ? (<ExploreMapItem
                        setLoc={props.setLoc}
                        setShowComments={props.setShowComments}
                        project={entry}
                    />) : (<ExploreTilesetItem
                        setLoc={props.setLoc}
                        setShowComments={props.setShowComments}
                        project={entry}
                    />)
                ))}
                {/* Shouldnt count here be projects.length/limit(=10) */}
                <MakePaginations count={projects.length} />

            </Box>


        </Box >
    )
}
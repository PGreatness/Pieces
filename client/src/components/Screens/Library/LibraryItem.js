import React from 'react'
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PublicIcon from '@mui/icons-material/Public';
import AddIcon from '@mui/icons-material/Add';
import { useState, useContext } from 'react'
import './css/library.css';
import GlobalStoreContext from '../../../store/store';

export default function LibraryItem(props) {

    const { store } = useContext(GlobalStoreContext);
    const { project } = props;
    console.log(project)
    const [ isPublic, setIsPublic ] = useState(project.isPublic);
    const [ name, setName ] = useState(project.mapName);

    return (
        <LibraryItem
            id={project._id}
            key={project._id}
        >
            <Box sx={{ marginLeft:"20px", boxShadow: "5px 5px rgb(0 0 0 / 20%)", borderRadius:"16px" }} style={{marginBottom: "60px", width: '25%', height: '78%', position: 'relative' }}>
                <img className='library_image' src={require("../../images/map.jpg")} width="100%" height="100%" border-radius="16px"></img>
                {isPublic 
                    ? <LockIcon className='library_lock_icon'></LockIcon>
                    : <LockOpenIcon className='library_lock_icon'></LockOpenIcon>
                }
                <div className="library_overlay">
                    <Box style={{ display: 'flex', flexDirection: 'row' }} >
                        <Box style={{ width:'50%', display: 'flex', flexDirection: 'column' }} >
                            <div className="library_project_title">Default Name</div>
                            <div className="library_project_author">by Username</div>
                        </Box>
                        <Box style={{ width: '50%', paddingLeft: '70px', paddingRight:'20px', paddingTop:"10px", display: 'flex', alignItems: 'center', justifyContent:'end', flexDirection: 'row' }} >
                            <DownloadIcon sx={{ fontSize: 20 }}></DownloadIcon>
                            <FavoriteIcon sx={{ fontSize: 20, px: 1, color: 'cyan' }}></FavoriteIcon>
                            <EditIcon sx={{ fontSize: 20, color: 'gray' }}></EditIcon>
                        </Box>
                    </Box>
                </div>
            </Box>
        </LibraryItem>
    )
}



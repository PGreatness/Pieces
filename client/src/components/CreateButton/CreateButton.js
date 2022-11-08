import { React, useState, useRef } from "react";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import './css/createButton.css';
import CreateMenuItem from './createMenuItem';
import { List, Grow, Popper } from "@mui/material";
import MapIcon from '@mui/icons-material/Map';
import GridViewIcon from '@mui/icons-material/GridView';
import { styled } from "@mui/material";

export default function CreateButton(props) {

    if (props.color !== undefined) {
        var color = props.color;
        document.documentElement.style.setProperty('--createButtonColor', color);
    }

    const PremadeFab = styled(Fab)({
        position: 'relative',
        bottom: 0,
        left: 0,
        width: '75px',
        height: '75px',
        zIndex: '100',
        boxShadow: 'none',
        backgroundColor: 'var(--createButtonColor, var(--color))',
        '&:hover': {
            backgroundColor: 'var(--createButtonColor, var(--color))',
        }
    });

    const [anchorEl, setAnchorEl] = useState(null);
    const active = Boolean(anchorEl);

    const handleClick = () => {
        let button = document.getElementsByClassName('create-button')[0];
        if (button.classList.contains('active')) {
            button.classList.remove('active');
        } else {
            button.classList.add('active');
        }
    }

    document.addEventListener('click', (e) => {
        // if the click location is in the create-button-container, do nothing
        // otherwise set active to false
        if (e.target.closest('.create-button-container') === null) {
            setAnchorEl(null);
        }
    })

    const popper = () => {
        console.log(document.getElementsByClassName('create-button')[0]);
        return (
            <Popper
                open={active}
                anchorEl={document.getElementsByClassName('create-button-container')[0]}
                placement="left-end"
                transition className="create-menu-item"
                disablePortal={true}
                modifiers={[
                    {
                        name: 'flip',
                        enabled: false,
                        options: {
                            altBoundary: false,
                            rootBoundary: 'viewport',
                            padding: 8,
                        },
                    },
                    {
                        name: 'preventOverflow',
                        enabled: false,
                        options: {
                            altAxis: false,
                            altBoundary: false,
                            tether: true,
                            rootBoundary: 'viewport',
                            padding: 8,
                        },
                    },
                    {
                        name: 'arrow',
                        enabled: true,
                        options: {
                            element: document.getElementsByClassName('create-button-popper-arrow')[0],
                        },
                    },
                ]}
            >
                    {({ TransitionProps }) => (
                        <Grow {...TransitionProps} timeout={350} style={{transformOrigin: 'bottom right'}}>
                            <Box>
                                <List className='create-button-menu'>
                                    {/* TODO: add modals to each of these */}
                                    <CreateMenuItem icon={<MapIcon />} text="Create New Map" setLoc={props.setLoc} loc={'map/1'}/>
                                    <CreateMenuItem icon={<GridViewIcon />} text="Create New Tileset" setLoc={props.setLoc} loc={'tileset/1'}/>
                                </List>
                            </Box>
                        </Grow>
                    )
}
            </Popper >
        );
    }

return (
    <Box className='create-button-container'>
        {popper()}
        <div clssName='create-button-popper-arrow' data-popper-arrow x_arrow="x"></div>
        <PremadeFab color="primary" className={`create-button${active ? ' active' : ''}`} onClick={handleClick} tabIndex={0} onTransitionEnd={(e) => { if (e.propertyName === 'background-color') setAnchorEl(anchorEl ? null : e.currentTarget); }} >
            <ControlPointIcon />
        </PremadeFab>
    </Box>
);
}
import moreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { createTheme, styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { ThemeProvider } from '@mui/material/styles';
import { useState, useContext, useEffect } from 'react';
import AuthContext from '../../auth/auth';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';

// import './css/SidebarUser.css';

const WhiteMore = styled(moreHorizIcon)({
  color: "white",
  '& .MuiSvgIcon-colorPrimary': {
    color: 'white',
  },
  '&:hover': {
    color: '#2dd4cf',
  },
});

const WhitePersonAdd = styled(PersonAddIcon)({
  color: "white",
  '& .MuiSvgIcon-colorPrimary': {
    color: 'white',
  },
  '&:hover': {
    color: '#2dd4cf',
  },
});

export default function SidebarUser(props) {
  const [isOnline, setIsOnline] = useState(props.isOnline);
  const [isFriend, setIsFriend] = useState(props.isFriend);
  const { auth } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = createTheme({
    palette: {
      offline: {
        main: '#434643'
      },
      online: {
        main: '#4caf50'
      }
    }
  });

  const handleAddFriend = async (sendToId) => {
    let response = await auth.sendFriendRequest(auth.user._id, sendToId)
  }

  var online = (jsx) => <ThemeProvider theme={theme}><Badge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot' color='online'>{jsx}</Badge></ThemeProvider>;
  var offline = (jsx) => <ThemeProvider theme={theme}><Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color='offline'>{jsx}</Badge></ThemeProvider>;
  let name = props.user.firstName.concat(" ", props.user.lastName);
  let startinguser = "@"
  let username = startinguser.concat(props.user.userName);
  const buildUser = () => {
    // see if user is logged in currently
    return (
      <ListItem sx={{ color: 'white' }}>
        <ListItemAvatar>
          {isOnline ? online(<Avatar alt={props.username} src={props.profilePic} />) : offline(<Avatar alt={props.username} src={props.profilePic} />)}
        </ListItemAvatar>
        <ListItemText primary={name} secondary={username} style={{ width: '100%' }} />
        <ListItemButton style={{ backgroundColor: 'transparent' }} sx={{ '&hover': { color: 'black' } }}>
          {isFriend ? <div>
                        <Button
                          id="basic-button"
                          aria-controls={open ? 'basic-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          onClick={handleClick}
                        >
                          <WhiteMore />
                        </Button>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button',
                          }}
                        >
                          <MenuItem onClick={handleClose}>Profile</MenuItem>
                          <MenuItem onClick={handleClose}>Chat</MenuItem>
                          <MenuItem onClick={handleClose}>Remove</MenuItem>
                        </Menu>
                      </div> : <WhitePersonAdd onClick={() => {handleAddFriend(props.user._id)}} />}
        </ListItemButton>
        <Divider />
      </ListItem>

    )
  }

  return (
    <>
      {buildUser()}
    </>
  );
}
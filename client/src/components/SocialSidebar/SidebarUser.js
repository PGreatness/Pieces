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
import React from 'react';

// import './css/SidebarUser.css';

const WhiteMore = styled(moreHorizIcon)({
  color: "white",
  '& .MuiSvgIcon-root': {
    color: 'white',
  },
  '& .MuiSvgIcon-colorPrimary': {
    color: 'white',
  },
  '&:hover': {
    color: '#2dd4cf',
  },
});

const WhitePersonAdd = styled(PersonAddIcon)({
  color: "white",
  '& .MuiSvgIcon-root': {
    color: 'white',
  },
  '& .MuiSvgIcon-colorPrimary': {
    color: 'white',
  },
  '&:hover': {
    color: '#2dd4cf',
  },
});

export default function SidebarUser(props) {
  const [isOnline, setIsOnline] = React.useState(props.isOnline);
  const [isFriend, setIsFriend] = React.useState(props.isFriend);

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

  var online = (jsx) => <ThemeProvider theme={theme}><Badge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant='dot' color='online'>{jsx}</Badge></ThemeProvider>;
  var offline = (jsx) => <ThemeProvider theme={theme}><Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color='offline'>{jsx}</Badge></ThemeProvider>;
  const buildUser = () => {
    // see if user is logged in currently
    return (
      <ListItem sx={{ color: 'white' }}>
        <ListItemAvatar>
          {isOnline ? online(<Avatar alt={props.username} src={props.profilePic} />) : offline(<Avatar alt={props.username} src={props.profilePic} />)}
        </ListItemAvatar>
        <ListItemText primary={props.user.username} style={{ width: '100%' }} />
        <ListItemButton style={{ backgroundColor: 'transparent' }} sx={{ '&hover': { color: 'black' } }}>
          {isFriend ? <WhiteMore /> : <WhitePersonAdd />}
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
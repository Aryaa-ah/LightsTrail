import React, {  useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import LocationDialogPopUp from './../components/LocationPopUp.tsx'; // Import the popup component
import LocationOnIcon from '@mui/icons-material/LocationOn';
import auroraIcon from '../images/logo.png'; // Adjust the path to your icon


const pages = [ 'Glossary', 'Weather Forecast'];
const settings = ['Profile', 'Change Language', 'Logout'];
interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}
interface ResponsiveAppBarProps {
  location: Location;  // Current location to display in the NavBar
  setLocation: (location: Location) => void;  // Function to update location
}

function ResponsiveAppBar({ location, setLocation }: ResponsiveAppBarProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [isLocationDialogOpen, setLocationDialogOpen] = React.useState(false); // State for popup
  //const [location, setLocation] = React.useState<string>('Set Location');

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLocationClick = () => {
    setLocationDialogOpen(true); // Open the popup
  };

  const handleCloseDialog = () => {
    setLocationDialogOpen(false); // Close the popup
  };

  useEffect(() => {
    // Call the handleClick function inside useEffect
    handleLocationClick();
  }, []); // Empty dependency array means this runs once after the initial render

  return (
    <>
      <AppBar position="absolute" sx={{backgroundColor:'#00000000'}}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
          <img
            src={auroraIcon}
            alt="Aurora Logo"
            style={{
              display: 'flex',
              width: 40, // Adjust size as needed
              height: 40,
              marginRight: '8px', // Space between icon and text
            }}
          />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Lights Trail
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page}
                    onClick={() => {
                      if (page === 'Location') {
                        handleLocationClick();
                      } else {
                        handleCloseNavMenu();
                      }
                    }}
                  >
                    <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                  </MenuItem>
                ))}
                <MenuItem
                    key={location.city_country}
                    onClick={() => {
                      
                        handleLocationClick();
                      
                    }}
                  ><Typography sx={{ textAlign: 'center' }}>{location.city_country}</Typography>
                  </MenuItem>
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Lights Trail
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => {
                    if (page === 'Location') {
                      handleLocationClick();
                    } else {
                      handleCloseNavMenu();
                    }
                  }}
                  sx={{ my: 2, color: 'white', display: 'block', marginLeft:'20px' }}
                >
                  {page}
                </Button>
              ))}
              
            </Box>
            <LocationOnIcon />
            <Button
                  key={location.city_country}
                  onClick={() => {
                    
                      handleLocationClick();
                    
                  }}
                  sx={{ my: 2, color: 'white', display: 'block', marginRight:'20px' }}
                >
                  {location.city_country}
                </Button>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Dialog Component */}
      <LocationDialogPopUp open={isLocationDialogOpen} onClose={handleCloseDialog} setLocation={setLocation}  />
    </>
  );
}

export default ResponsiveAppBar;

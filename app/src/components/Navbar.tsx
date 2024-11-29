import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationDialogPopUp from "./../components/LocationPopUp";
import auroraIcon from "../images/logo.png";
import { useAuth } from "../hooks/useAuth"; // Import useAuth hook

interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

interface ResponsiveAppBarProps {
  location: Location;
  setLocation: (location: Location) => void;
}

// Define the navigation items including new gallery routes
const pages = ["Gallery", "My Gallery", "Glossary", "Weather Forecast"];
const settings = ["Profile", "Change Language", "Logout"];

function ResponsiveAppBar({ location, setLocation }: ResponsiveAppBarProps) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user authentication status
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [isLocationDialogOpen, setLocationDialogOpen] = React.useState(false);

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
    setLocationDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setLocationDialogOpen(false);
  };

  // Handle navigation for pages
  const handleNavigation = (page: string) => {
    handleCloseNavMenu();
    switch (page) {
      case "Gallery":
        navigate("/gallery");
        break;
      case "My Gallery":
        if (user) {
          navigate("/my-gallery");
        } else {
          // Handle unauthorized access - maybe redirect to login
          navigate("/login");
        }
        break;
      case "Glossary":
        navigate("/glossary");
        break;
      case "Weather Forecast":
        navigate("/weather");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    handleLocationClick();
  }, []);

  // Filter pages based on authentication
  const filteredPages = pages.filter(
    (page) => page !== "My Gallery" || (page === "My Gallery" && user)
  );

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#00000000" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo and Brand */}
            <img
              src={auroraIcon}
              alt="Aurora Logo"
              style={{
                display: "flex",
                width: 40,
                height: 40,
                marginRight: "8px",
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Lights Trail
            </Typography>

            {/* Mobile Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="navigation menu"
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
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {filteredPages.map((page) => (
                  <MenuItem key={page} onClick={() => handleNavigation(page)}>
                    <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                  </MenuItem>
                ))}
                <MenuItem onClick={handleLocationClick}>
                  <Typography sx={{ textAlign: "center" }}>
                    {location.city_country}
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>

            {/* Desktop Brand for Mobile */}
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Lights Trail
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {filteredPages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavigation(page)}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    marginLeft: "20px",
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            {/* Location Button */}
            <LocationOnIcon />
            <Button
              onClick={handleLocationClick}
              sx={{
                my: 2,
                color: "white",
                display: "block",
                marginRight: "20px",
              }}
            >
              {location.city_country}
            </Button>

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Location Dialog */}
      <LocationDialogPopUp
        open={isLocationDialogOpen}
        onClose={handleCloseDialog}
        setLocation={setLocation}
      />
    </>
  );
}

export default ResponsiveAppBar;

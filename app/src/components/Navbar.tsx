/* eslint-disable @typescript-eslint/no-unused-vars */
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
import LanguageIcon from "@mui/icons-material/Language";
import LocationDialogPopUp from "./../components/LocationPopUp";
import auroraIcon from "../images/logo.png";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { t } from "i18next";
import { CheckIcon } from "lucide-react";

interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

interface ResponsiveAppBarProps {
  location: Location;
  setLocation: (location: Location) => void;
}

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "kn", name: "ಕನ್ನಡ" },
];

const pages = ["Gallery", "Glossary", "Weather Forecast"];

const settings = ["Profile", "Logout"]; // Removed language selection from here

function ResponsiveAppBar({ location, setLocation }: ResponsiveAppBarProps) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(
    null
  );
  const [isLocationDialogOpen, setLocationDialogOpen] = React.useState(false);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    handleCloseLangMenu();
  };

  const handleLocationClick = () => {
    setLocationDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setLocationDialogOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleCloseUserMenu();
  };

  const handleNavigation = (page: string) => {
    handleCloseNavMenu();
    switch (page) {
      case "Gallery":
        navigate("/gallery");
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

  const handleLogout = () => {
    authService.logout();
    handleCloseUserMenu();
  };

  useEffect(() => {
    handleLocationClick();
  }, []);

  const filteredPages = pages.filter(
    (page) => page !== "My Gallery" || (page === "My Gallery" && user)
  );

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#00000000" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
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

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
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
              </Menu>
            </Box>

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

            {/* Language Selection */}
            <Tooltip title="Change Language">
              <IconButton
                onClick={handleOpenLangMenu}
                sx={{ ml: 2, color: "white" }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElLang}
              open={Boolean(anchorElLang)}
              onClose={handleCloseLangMenu}
              sx={{ mt: 1 }}
            >
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  selected={i18n.language === lang.code}
                >
                  <ListItemText primary={lang.name} />
                  {i18n.language === lang.code && (
                    <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
                      <CheckIcon size={16} />
                    </ListItemIcon>
                  )}
                </MenuItem>
              ))}
            </Menu>

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
                  <Avatar
                    alt={user?.firstName || "User Avatar"}
                    src={`https://api.dicebear.com/9.x/identicon/svg?seed=${Math.random()
                      .toString(36)
                      .substring(
                        7
                      )}&backgroundColor=b6e3f4,c0aede,d1d4f9&scale=80&size=40&radius=50`}
                    sx={{
                      width: 40,
                      height: 40,
                      border: "2px solid rgba(255,255,255,0.2)",
                      backgroundColor: "transparent",
                    }}
                  />
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
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      if (setting === "Logout") {
                        handleLogout();
                      } else if (setting === "Profile") {
                        handleProfileClick();
                      }
                    }}
                  >
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

      <LocationDialogPopUp
        open={isLocationDialogOpen}
        onClose={handleCloseDialog}
        setLocation={setLocation}
      />
    </>
  );
}

export default ResponsiveAppBar;

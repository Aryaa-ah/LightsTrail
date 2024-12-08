/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Container,
  ListItemIcon,
  ListItemText,
  useMediaQuery
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Language as LanguageIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import { CheckIcon } from "lucide-react";
import LocationDialogPopUp from "./../components/LocationPopUp";
import auroraIcon from "../images/logo.png";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth";
import { useTranslation } from "react-i18next";

interface Location {
  city_country: string;
  latitude: number;
  longitude: number;
}

interface NavbarProps {
  location: Location;
  setLocation: (location: Location) => void;
}

declare var window: any;


const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "kn", name: "ಕನ್ನಡ" },
];

export default function Navbar({ location, setLocation }: NavbarProps) {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { user } = useAuth();
 const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const pages = [
    { key: "gallery", path: "gallery" },
    { key: "glossary", path: "glossary" },
    { key: "liveData", path: "live-data" },
    { key: "webCam", path: "webcam" },
    { key: "bestLocations", path: "best-locations" },
    { key: "TourismGuide", path: "Tourism-Guide"},
  ];

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  const [isLocationDialogOpen, setLocationDialogOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleOpenMenu =
    (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) =>
    (event: React.MouseEvent<HTMLElement>) => {
      setter(event.currentTarget);
    };

  const handleCloseMenu =
    (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) =>
    () => {
      setter(null);
    };

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setAnchorElLang(null);
  };

  const handleNavigation = (path: string) => {
    setAnchorElNav(null);
    navigate(`/${path}`);
  };

  const handleLogout = () => {
    authService.logout();
    setAnchorElUser(null);
    navigate("/login");
  };

  useEffect(() => {
    setLocationDialogOpen(true);
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        setScrollPosition(window.scrollY);
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const appBarStyle = {
    backgroundColor: `rgba(0, 0, 0, ${Math.min(scrollPosition / 300, 0.8)})`,
    transition: "background-color 0.3s ease",
  };

  return (
    <>
      <AppBar position="fixed" style={appBarStyle}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img
              src={auroraIcon}
              alt="Aurora Logo"
              style={{
                width: 40,
                height: 40,
                marginRight: "8px",
                cursor: "pointer",
              }}
              onClick={() => {
                setAnchorElNav(null);
                navigate("/home");
              }}
            />
            <Typography
              variant="h6"
              component="a"
              sx={{
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize:"1.4em",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                setAnchorElNav(null);
                navigate("/home");
              }}
            >
              Lights Trail
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                onClick={handleOpenMenu(setAnchorElNav)}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseMenu(setAnchorElNav)}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.key}
                    onClick={() => handleNavigation(page.path)}
                  >
                    <Typography textAlign="center">
                      {t(`navbar.${page.key}`)}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page.key}
                  onClick={() => handleNavigation(page.path)}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    marginLeft: "20px",
                    fontSize : "1em"
                  }}
                >
                  {t(`navbar.${page.key}`)}
                </Button>
              ))}
            </Box>

            <Tooltip title="Change Language">
              <IconButton
                onClick={handleOpenMenu(setAnchorElLang)}
                sx={{ ml: 2, color: "white" }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElLang}
              open={Boolean(anchorElLang)}
              onClose={handleCloseMenu(setAnchorElLang)}
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

            <Tooltip title={isMobile ? location.city_country : ""} arrow>
        <LocationOnIcon
          onClick={() => setLocationDialogOpen(true)}
          sx={{ cursor: "pointer", color: "white", mr: isMobile ? 0 : 1 }}
        />
      </Tooltip>
      {!isMobile && (
        <Button
          onClick={() => setLocationDialogOpen(true)}
          sx={{ my: 2, color: "white" }}
        >
          {location.city_country}
        </Button>
      )}

            {user && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={handleOpenMenu(setAnchorElUser)}
                    sx={{ p: 0 }}
                  >
                    <Avatar
                      alt={user?.firstName || "User Avatar"}
                      src={`https://api.dicebear.com/9.x/identicon/svg?seed=${user?.id}`}
                      sx={{ width: 40, height: 40 }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseMenu(setAnchorElUser)}
                >
                  <MenuItem onClick={() => navigate("/profile")}>
                    {t("navbar.profile")}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    {t("navbar.logout")}
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <LocationDialogPopUp
        open={isLocationDialogOpen}
        onClose={() => setLocationDialogOpen(false)}
        setLocation={setLocation}
      />
    </>
  );
}

// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   AppBar,
//   Box,
//   Container,
//   IconButton,
//   Toolbar,
//   Typography,
//   useTheme,
//   useMediaQuery,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Button,
// } from "@mui/material";
// import { Menu as MenuIcon } from "@mui/icons-material";
// import { useAuth } from "../hooks/useAuth";

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const [mobileOpen, setMobileOpen] = React.useState(false);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const location = useLocation();
//   const { user } = useAuth();

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const navItems = [
//     { label: "Gallery", path: "/gallery" },
//     { label: "My Photos", path: "/my-gallery", authRequired: true },
//   ];

//   const isActiveRoute = (path: string) => location.pathname === path;

//   const renderNavItems = () => (
//     <>
//       {navItems.map(
//         (item) =>
//           (!item.authRequired || user) && (
//             <Button
//               key={item.path}
//               component={Link}
//               to={item.path}
//               sx={{
//                 color: isActiveRoute(item.path) ? "primary.main" : "inherit",
//                 "&:hover": {
//                   color: "primary.main",
//                 },
//               }}
//             >
//               {item.label}
//             </Button>
//           )
//       )}
//     </>
//   );

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//       <AppBar 
//         position="sticky" 
//         elevation={0}
//         sx={{ 
//           bgcolor: "background.paper",
//           borderBottom: 1,
//           borderColor: "divider"
//         }}
//       >
//         <Toolbar>
//           <Container maxWidth="xl">
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
//               {/* Logo/Brand */}
//               <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     fontWeight: 700,
//                     background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
//                     backgroundClip: "text",
//                     textFillColor: "transparent",
//                   }}
//                 >
//                   LightTrails
//                 </Typography>
//               </Link>

//               {/* Mobile Menu Button */}
//               {isMobile ? (
//                 <IconButton
//                   color="inherit"
//                   aria-label="open drawer"
//                   edge="start"
//                   onClick={handleDrawerToggle}
//                 >
//                   <MenuIcon />
//                 </IconButton>
//               ) : (
//                 /* Desktop Navigation */
//                 <Box sx={{ display: "flex", gap: 2 }}>
//                   {renderNavItems()}
//                 </Box>
//               )}
//             </Box>
//           </Container>
//         </Toolbar>
//       </AppBar>

//       {/* Mobile Navigation Drawer */}
//       <Drawer
//         variant="temporary"
//         anchor="right"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{
//           keepMounted: true, // Better mobile performance
//         }}
//         sx={{
//           display: { xs: "block", md: "none" },
//           "& .MuiDrawer-paper": { 
//             boxSizing: "border-box", 
//             width: 240,
//             bgcolor: "background.paper" 
//           },
//         }}
//       >
//         <List>
//           {navItems.map((item) => (
//             (!item.authRequired || user) && (
//               <ListItem 
//                 key={item.path}
//                 component={Link}
//                 to={item.path}
//                 onClick={handleDrawerToggle}
//                 sx={{
//                   bgcolor: isActiveRoute(item.path) ? "action.selected" : "transparent",
//                 }}
//               >
//                 <ListItemText primary={item.label} />
//               </ListItem>
//             )
//           ))}
//         </List>
//       </Drawer>

//       {/* Main Content */}
//       <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
//         <Container maxWidth="xl">
//           {children}
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default Layout;

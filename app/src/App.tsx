import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Layout from "./components/Layout";
import GalleryPage from "./pages/GalleryPage";
import UserGallery from "./pages/UserGallery";

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196F3',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <div className="min-h-screen bg-background-default">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <Router>
            <Layout>
              <Routes>
                <Route path="/gallery" element={<GalleryPage userOnly={false} />} />
                <Route path="/my-gallery" element={<UserGallery userOnly={true} />} />
              </Routes>
            </Layout>
          </Router>
        </Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;

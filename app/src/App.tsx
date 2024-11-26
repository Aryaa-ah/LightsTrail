import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography } from '@mui/material';
import Auth from './pages/Auth';
import { authService } from './services/auth';

// Simple Welcome Page
const WelcomePage = () => {
    const user = authService.getCurrentUser();
    return (
        <Box 
            sx={{ 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#1a1a1a',
                color: 'white'
            }}
        >
            <Typography variant="h4">
                Welcome, {user?.firstName || 'User'}!
            </Typography>
        </Box>
    );
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = authService.isAuthenticated();
    return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    }
                }
            }
        }
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <WelcomePage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
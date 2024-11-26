import { useState } from 'react';
import {
    Container,
    Box,
    Paper,
    Tabs,
    Tab,
    Typography,
    Button,
    Divider
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import Login from '../components/Login';
import Signup from '../components/Signup';
import { authService } from '../services/auth';

export default function Auth() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.50',
                py: 4
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabIndex}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{
                                '& .MuiTab-root': {
                                    py: 3,
                                    fontSize: '1.1rem'
                                }
                            }}
                        >
                            <Tab label="Sign In" />
                            <Tab label="Sign Up" />
                        </Tabs>
                    </Box>

                    <Box sx={{ p: 4 }}>
                        <Typography
                            variant="h5"
                            align="center"
                            fontWeight="bold"
                            gutterBottom
                            color="primary"
                        >
                            Welcome to LightsTrail
                        </Typography>

                        {/* Google Sign In Button */}
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<GoogleIcon />}
                            onClick={() => authService.handleGoogleLogin()}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem'
                            }}
                        >
                            Continue with Google
                        </Button>

                        <Divider sx={{ my: 3 }}>OR</Divider>

                        {/* Login/Signup Forms */}
                        {tabIndex === 0 ? <Login /> : <Signup />}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
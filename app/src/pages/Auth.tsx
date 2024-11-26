import { useState } from 'react';
import { Container, Box, Tabs, Tab } from '@mui/material';
import Login from '../components/Login';
import Signup from '../components/Signup';

export default function Auth() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'grey.50',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                pt: 8,
                px: 2
            }}
        >
            <Container maxWidth="sm">
                <Box sx={{ bgcolor: 'background.paper', borderRadius: '4px 4px 0 0' }}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Sign In" />
                        <Tab label="Sign Up" />
                    </Tabs>
                </Box>
                
                {tabIndex === 0 ? <Login /> : <Signup />}
            </Container>
        </Box>
    );
}
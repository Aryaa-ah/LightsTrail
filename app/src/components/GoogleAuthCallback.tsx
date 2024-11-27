import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

export default function GoogleAuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // Store the token
            localStorage.setItem('authToken', token);
            // Redirect to home
            navigate('/');
        } else {
            // Handle error
            navigate('/auth');
        }
    }, [navigate, location]);

    return (
        <Box sx={{ 
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <CircularProgress />
        </Box>
    );
}
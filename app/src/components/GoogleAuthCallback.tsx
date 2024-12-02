import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import { authService } from '../services/auth';
import React from 'react';

export default function GoogleAuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
            setError(decodeURIComponent(error));
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        if (!token) {
            setError('No authentication token received');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        try {
            // Make a request to get user data after Google auth
            const getUserData = async () => {
                const response = await fetch('http://localhost:3002/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    localStorage.setItem('user', JSON.stringify(userData));
                }
                authService.handleGoogleAuthSuccess(token);
            };
            
            getUserData();
        } catch (err) {
            setError('Failed to process authentication');
            setTimeout(() => navigate('/login'), 3000);
        }
    }, [navigate, location]);

    if (error) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2
                }}
            >
                <Typography color="error">{error}</Typography>
                <Typography>Redirecting to login...</Typography>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <CircularProgress />
        </Box>
    );
}
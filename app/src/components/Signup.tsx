import { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    Paper,
    Grid
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { SignupCredentials } from '../types/auth';
import { authService } from '../services/auth';

export default function Signup() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<SignupCredentials>({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (prop: keyof SignupCredentials) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCredentials(prev => ({
            ...prev,
            [prop]: event.target.value
        }));
        setError(null);
    };

    const validateForm = (): boolean => {
        if (!credentials.email || !credentials.password || !credentials.firstName || !credentials.lastName) {
            setError('All fields are required');
            return false;
        }
        if (credentials.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        setError(null);

        try {
            const response = await authService.signup(credentials);
            console.log('Signup successful:', response);
            
            // Automatically log in after successful signup
            await authService.login({
                email: credentials.email,
                password: credentials.password
            });
            
            navigate('/');
        } catch (err) {
            console.error('Signup error:', err);
            setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
            <Typography variant="h5" component="h1" gutterBottom align="center">
                Create Your Account
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            label="First Name"
                            value={credentials.firstName}
                            onChange={handleChange('firstName')}
                            error={!!error}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            required
                            fullWidth
                            label="Last Name"
                            value={credentials.lastName}
                            onChange={handleChange('lastName')}
                            error={!!error}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={credentials.email}
                    onChange={handleChange('email')}
                    error={!!error}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={handleChange('password')}
                    error={!!error}
                    helperText="Password must be at least 8 characters long"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ mt: 3, mb: 2 }}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
            </Box>
        </Paper>
    );
}
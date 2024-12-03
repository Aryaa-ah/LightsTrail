// import { useState } from 'react';
// import {
//     Box,
//     Button,
//     TextField,
//     InputAdornment,
//     IconButton,
//     Alert,
//     Paper
// } from '@mui/material';
// import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { LoginCredentials } from '../types/auth';
// import { authService } from '../services/auth';

// export default function Login() {
//     const navigate = useNavigate();
//     const [credentials, setCredentials] = useState<LoginCredentials>({
//         email: '',
//         password: ''
//     });
//     const [showPassword, setShowPassword] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);

//     const handleChange = (prop: keyof LoginCredentials) => (
//         event: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         setCredentials(prev => ({
//             ...prev,
//             [prop]: event.target.value
//         }));
//         setError(null);
//     };

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();
//         setLoading(true);
//         setError(null);

//         try {
//             const response = await authService.login(credentials);
//             console.log('Login successful:', response);
//             navigate('/');
//         } catch (err) {
//             console.error('Login error:', err);
//             setError(err instanceof Error ? err.message : 'Login failed');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box component="form" onSubmit={handleSubmit} noValidate>
//             {error && (
//                 <Alert severity="error" sx={{ mb: 2 }}>
//                     {error}
//                 </Alert>
//             )}

//             <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email Address"
//                 name="email"
//                 autoComplete="email"
//                 autoFocus
//                 value={credentials.email}
//                 onChange={handleChange('email')}
//                 InputProps={{
//                     startAdornment: (
//                         <InputAdornment position="start">
//                             <Email color="action" />
//                         </InputAdornment>
//                     ),
//                 }}
//             />
//             <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="Password"
//                 type={showPassword ? 'text' : 'password'}
//                 id="password"
//                 autoComplete="current-password"
//                 value={credentials.password}
//                 onChange={handleChange('password')}
//                 InputProps={{
//                     startAdornment: (
//                         <InputAdornment position="start">
//                             <Lock color="action" />
//                         </InputAdornment>
//                     ),
//                     endAdornment: (
//                         <InputAdornment position="end">
//                             <IconButton
//                                 aria-label="toggle password visibility"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 edge="end"
//                             >
//                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                             </IconButton>
//                         </InputAdornment>
//                     ),
//                 }}
//             />
//             <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 disabled={loading}
//                 sx={{
//                     mt: 3,
//                     mb: 2,
//                     py: 1.5,
//                     fontSize: '1rem',
//                     textTransform: 'none',
//                     borderRadius: 2
//                 }}
//             >
//                 {loading ? 'Signing in...' : 'Sign In'}
//             </Button>
//         </Box>
//     );
// }

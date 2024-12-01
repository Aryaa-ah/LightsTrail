// import { useState } from 'react';
// import {
//     Box,
//     Button,
//     TextField,
//     InputAdornment,
//     IconButton,
//     Alert,
//     Grid
// } from '@mui/material';
// import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { SignupCredentials } from '../types/auth';
// import { authService } from '../services/auth';

// export default function Signup() {
//     const navigate = useNavigate();
//     const [credentials, setCredentials] = useState<SignupCredentials>({
//         email: '',
//         password: '',
//         firstName: '',
//         lastName: ''
//     });
//     const [showPassword, setShowPassword] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);

//     const handleChange = (prop: keyof SignupCredentials) => (
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
//             await authService.signup(credentials);
//             // Auto login after signup
//             await authService.login({
//                 email: credentials.email,
//                 password: credentials.password
//             });
//             navigate('/');
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Signup failed');
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

//             <Grid container spacing={2}>
//                 <Grid item xs={6}>
//                     <TextField
//                         required
//                         fullWidth
//                         id="firstName"
//                         label="First Name"
//                         name="firstName"
//                         autoComplete="given-name"
//                         value={credentials.firstName}
//                         onChange={handleChange('firstName')}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <Person color="action" />
//                                 </InputAdornment>
//                             ),
//                         }}
//                     />
//                 </Grid>
//                 <Grid item xs={6}>
//                     <TextField
//                         required
//                         fullWidth
//                         id="lastName"
//                         label="Last Name"
//                         name="lastName"
//                         autoComplete="family-name"
//                         value={credentials.lastName}
//                         onChange={handleChange('lastName')}
//                         InputProps={{
//                             startAdornment: (
//                                 <InputAdornment position="start">
//                                     <Person color="action" />
//                                 </InputAdornment>
//                             ),
//                         }}
//                     />
//                 </Grid>
//             </Grid>

//             <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 id="email"
//                 label="Email Address"
//                 name="email"
//                 autoComplete="email"
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
//                 autoComplete="new-password"
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
//                 {loading ? 'Creating Account...' : 'Sign Up'}
//             </Button>
//         </Box>
//     );
// }
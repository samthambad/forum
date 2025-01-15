'use client';
import { Button, CardActions, Typography, TextField, Box } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token); // Save token
      console.log('User logged in');
    } else {
      console.error('Login error:', data.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
      }}
    >
      {/* Left Side: Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 3,
        }}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            marginBottom: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1, // Add spacing between elements
          }}
        >
          Log in
          <Typography
            variant="h4"
            component={Link}
            href="/signup"
            sx={{
              color: 'text.secondary', // Faded color for contrast
              textDecoration: 'none', // Match "Log in" style
              '&:hover': { color: '#3498db' }, // Darker on hover
            }}
          >
            or sign up
          </Typography>
        </Typography>
        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <TextField
            label="Username"
            placeholder="Enter your username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Password"
            placeholder="Enter a secure password"
            variant="outlined"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ marginBottom: 3 }}
          />
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 1,
              }}
            >
              Log In
            </Button>
          </CardActions>
        </form>
      </Box>

      {/* Right Side: Pattern */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: 'linear-gradient(to right, #ffffff, #3498db)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </Box>
  );
}

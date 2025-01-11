'use client';
import { Button, CardActions, Typography, TextField, Box } from '@mui/material';
import router from 'next/router';
import { useState } from 'react';

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/signUp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('User signed up:', data);
      router.push("/login");
    } else {
      console.error('Signup error:', data.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row', // Row layout
        height: '100vh',
        margin: 0,
      }}
    >
      {/* Left Side: Login Form */}
      <Box
        sx={{
          flex: 1, // Take up 50% of the screen width
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: 3,
        }}
      >
        <Typography variant="h2" component="h2" sx={{ marginBottom: 3 }}>
          Sign Up
        </Typography>
        <form
          onSubmit={handleSignUp}
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
            value={form.username}
            onChange={handleChange}
            required
            size='small'
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Password"
            placeholder="Enter a secure password"
            variant="outlined"
            size='small'
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            sx={{ marginBottom: 3 }}
          />
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              size="small"
              sx={{
                margin: 0,
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 1,
                background: "#656565",
                width: '100%',
              }}
            >
              Sign Up
            </Button>
          </CardActions>
        </form>
      </Box>

      {/* Right Side: Pattern */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: 'linear-gradient(to right, #ffffff,  #656565 )',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </Box>
  );
}

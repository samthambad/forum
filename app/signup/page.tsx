'use client';
import { Button, CardActions, Typography, TextField, Box } from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { push } = useRouter();

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
      push("/login");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
      }}
    >
      <Toaster position="top-left" />
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
            gap: 1,
          }}
        >
          Sign up
          <Typography
            variant="h4"
            component={Link}
            href="/login"
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { color: '#3498db' },
            }}
          >
            or log in
          </Typography>
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
            id="username"
            name="username"
            size="small"
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Email"
            placeholder="Enter your email"
            variant="outlined"
            value={form.email}
            onChange={handleChange}
            required
            name="email"
            type="email"
            id="email"
            size="small"
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Password"
            placeholder="Enter a secure password"
            variant="outlined"
            size="small"
            name="password"
            type="password"
            id="password"
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
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(to right, #ffffff, #656565)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </Box>
  );
}

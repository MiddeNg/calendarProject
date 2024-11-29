import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { TextField, Button, Typography, Alert } from '@mui/material';
import backendService from './backend';

const provider = new GoogleAuthProvider();

const auth = getAuth();
const Login = ({ onLoginSuccess }) => {
  const [loginFailMessage, setLoginFailMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
      try {
        const userCredential = await signInWithPopup(auth, provider);
        await backendService.login(userCredential.user.getIdToken()); 
        onLoginSuccess(userCredential.user);
      } catch (error) {
        let defaultErrorMessage = 'Failed to login. Please try again.';
        setLoginFailMessage(error.message ?? error.statusText ?? defaultErrorMessage);
      }
    }

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Signed in
      await backendService.login(userCredential.user.getIdToken()); 
      onLoginSuccess(userCredential.user);
    } catch (error) {
        let defaultErrorMessage = 'Failed to login. Please try again.';
        setLoginFailMessage(error.message ?? error.statusText ?? defaultErrorMessage);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container card p-4">
        <Typography variant="h4" gutterBottom>Login</Typography>
        {loginFailMessage && (
          <Alert severity="error" className="mt-3">{loginFailMessage}</Alert>
        )}
        <form onSubmit={handleEmailLogin}>
          <TextField
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login with Email/Password
          </Button>
        </form>

        <Button
          onClick={handleGoogleLogin}
          variant="secondary"
        >
          Login with Google
        </Button>
        <Button
          onClick={async () => {
            try {
              const userCredential = await createUserWithEmailAndPassword(auth, email, password);
              onLoginSuccess(userCredential.user);
            } catch (error) {
              setLoginFailMessage(error.message);
            }
          }}
          variant="secondary"
        >
          create account
        </Button>
      </div>
    </div>
  );
};
export default Login;

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { TextField, Button, Typography, Snackbar, Alert } from '@mui/material';

const provider = new GoogleAuthProvider();

const auth = getAuth();
const Login = ({ onLoginSuccess }) => {
  const [loginFailMessage, setLoginFailMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleGoogleLoginFail = () => {
    setLoginFailMessage('Failed to login to Google. Please try again.');
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        console.log("user", userCredential.user)
        onLoginSuccess(userCredential.user);
      })
      .catch((error) => {
        setLoginFailMessage(error.message);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="login-overlay">
      <div className="login-container card p-4">
        <Typography variant="h4" gutterBottom>Login</Typography>
        {loginFailMessage && (
          <Snackbar open={true} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert severity="error">{loginFailMessage}</Alert>
          </Snackbar>
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
          onClick={() => {
            signInWithPopup(auth, provider)
            .then((result) => {
              onLoginSuccess(result.user);
            })
            .catch((error) => handleGoogleLoginFail());
          }}
          variant="secondary"
        >
          Login with Google
        </Button>
        <Button
          onClick={() => {
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed in 
                onLoginSuccess(userCredential.user);
              })
              .catch((error) => {
                setLoginFailMessage(error.message);
              });
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
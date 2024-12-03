import React, { useState } from 'react';
import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signInWithPopup,
  setPersistence, browserLocalPersistence,
  onAuthStateChanged, signOut, sendPasswordResetEmail,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { TextField, Button, Typography, Alert } from '@mui/material';

const provider = new GoogleAuthProvider();

const auth = getAuth();
const Login = ({ setUser }) => {
  const [loginFailMessage, setLoginFailMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  // for google login redirect
  getRedirectResult(auth)
    .then((result) => {
      console.log(result)
      if (result && result.user) {
        setUser(result.user);
      }
    }).catch((error) => {
      console.log(error) 
      setLoginFailMessage(error.message ?? error.statusText ?? 'Failed to login with google. Please try again.');
    });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  const handleGoogleLogin = async () => {
    try {
      provider.setCustomParameters({
        prompt: 'select_account'
     });
      await setPersistence(auth, browserLocalPersistence);
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.log(error.code)
      console.log(error.message)
      if (error.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, provider);
        } catch (error) {
          let defaultErrorMessage = 'Failed to login. Please try again.';
          setLoginFailMessage(error.message ?? error.statusText ?? defaultErrorMessage);    
          return
        }
      }
      let defaultErrorMessage = 'Failed to login. Please try again.';
      setLoginFailMessage(error.message ?? error.statusText ?? defaultErrorMessage);
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      // Signed in
    } catch (error) {
      let defaultErrorMessage = 'Failed to login. Please try again.';
      setLoginFailMessage(error.message ?? error.statusText ?? defaultErrorMessage);
    }
  };

  const handleForgetPassword = async () => {
    if (!email) {
      setLoginFailMessage('Please enter your email address.');
    } else {
      try {
        await sendPasswordResetEmail(auth, email);
        setLoginFailMessage('Password reset email sent. Please check your email.');
      } catch (error) {
        setLoginFailMessage(error.message);
      }
    }
  }

  const handleToggleRegister = () => {
    setShowRegister(!showRegister);
  }

  return showRegister ? (
    <Register setUser={setUser} setShowRegister={setShowRegister} />
  ) : (
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
        <Button onClick={handleForgetPassword} variant="secondary">
          Forgot Password?
        </Button>
        <Button onClick={handleToggleRegister} variant="secondary">
          Register
        </Button>
      </div>
    </div>
  );
}
const Register = ({setShowRegister}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registerFailMessage, setRegisterFailMessage] = useState('');

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setRegisterFailMessage('Passwords do not match.');
      } else {
        await setPersistence(auth, browserLocalPersistence);
        await createUserWithEmailAndPassword(auth, email, password);
        setRegisterFailMessage('Account created.');
      }
    } catch (error) {
      setRegisterFailMessage(error.message);
    }
  }

  return (
    <div className="login-overlay">
      <div className="login-container card p-4">
        <Typography variant="h4" gutterBottom>Register</Typography>
        {registerFailMessage && (
            <Alert severity="error" className="mt-3">{registerFailMessage}</Alert>
        )}
        <form onSubmit={handleCreateAccount}>
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
          <TextField
            label="Enter password again"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="secondary">
            Create account
          </Button>
          <Button onClick={() => setShowRegister(false)} variant="secondary">
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
};

const logout = async () => {
  signOut(auth);
}
export { Login, logout };

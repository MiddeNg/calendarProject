import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { Button } from 'react-bootstrap';

const provider = new GoogleAuthProvider();

const auth = getAuth();
const Login = ({ onLoginSuccess }) => {
  const [loginFailMessage, setLoginFailMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <div className="login-overlay container">
      <div className="login-container card p-4">
        <h2>Login</h2>
        {loginFailMessage && (
          <div className="alert alert-danger">{loginFailMessage}</div>
        )}

        <form onSubmit={handleEmailLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary mb-3">Login with Email/Password</button>
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
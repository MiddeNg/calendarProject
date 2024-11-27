import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const Login = ({ onLoginSuccess }) => {
  const [loginFailMessage, setLoginFailMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLoginFail = () => {
    setLoginFailMessage('Failed to login to Google. Please try again.');
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    // TODO: Implement email/password login logic here
  };

  return (
    <div className="login-overlay container">
      <div className="login-container card p-4">
        <h2>Login</h2>

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

        {loginFailMessage && (
          <div className="alert alert-danger">{loginFailMessage}</div>
        )}

        <GoogleLogin
          onSuccess={credentialResponse => {
            let accessToken = credentialResponse.credential;
            onLoginSuccess(accessToken);
          }}
          onError={handleGoogleLoginFail}
        />
      </div>
    </div>
  );
};

export default Login;
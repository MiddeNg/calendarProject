import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './Login';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Check for JWT tokens or login status here
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setAccessToken(token);
    } else {
      setAccessToken(null);
    }
  }, []);

  const onLoginSuccess = ({ accessToken }) => {
    console.log("access_token", accessToken)
    // Implement email/password login logic here
    localStorage.setItem('jwtToken', accessToken);
    setAccessToken(accessToken);
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_O_AUTH_CLIENT_ID}>
    <div className="app">
      {!accessToken && <Login onLoginSuccess={onLoginSuccess} />}

      <div className={`main-content ${accessToken ? 'active' : 'inactive'}`}>
        {/* Your main calendar event management component goes here */}
        <h1>Main Component</h1>
      </div>
    </div>
    </GoogleOAuthProvider>
  );
};

export default App;
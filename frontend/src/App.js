import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './Login';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for JWT tokens or login status here
    const hasJWTToken = localStorage.getItem('jwtToken');
    if (hasJWTToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const onLoginSuccess = ({ access_token }) => {
    // Implement email/password login logic here
    setIsLoggedIn(true);
  };

  console.log(process.env.REACT_APP_O_AUTH_CLIENT_ID)
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_O_AUTH_CLIENT_ID}>
    <div className="app">
      {!isLoggedIn && <Login onLoginSuccess={onLoginSuccess} />}

      <div className={`main-content ${isLoggedIn ? 'active' : 'inactive'}`}>
        {/* Your main calendar event management component goes here */}
        <h1>Main Component</h1>
      </div>
    </div>
    </GoogleOAuthProvider>
  );
};

export default App;
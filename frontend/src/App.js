import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Calendar from './Calendar';
import Drawer from '@mui/material/Drawer';
import EventsView from './EventsView';
import { Container } from '@mui/material';
import Grid from '@mui/material/Grid2';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [date, setDate] = useState(null);
  const [showSidePanel, setShowSidePanel] = useState(false);

  useEffect(() => {
    // Check for JWT tokens or login status here
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setAccessToken(token);
    } else {
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    if (date) {
      setShowSidePanel(true);
    } else {
      setShowSidePanel(false);
    }
  }, [date]);

  const onLoginSuccess = ({ accessToken }) => {
    console.log("access_token", accessToken)
    localStorage.setItem('jwtToken', accessToken);
    setAccessToken(accessToken);
  };

  const handleAddEventClick = () => {
    // Logic for adding an event
    console.log('Add event clicked');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_O_AUTH_CLIENT_ID}>
      <div className="app">
        {!accessToken && <Login onLoginSuccess={onLoginSuccess} />}
        <div className={`main-content ${accessToken ? 'active' : 'inactive'}`}>
          <Grid container spacing={2}>
            <Grid item xs={12} size={7}>
              <Calendar setDate={setDate} />
            </Grid>
            <Grid item xs={0} size={5} sx={{ display: { lg: 'block', md: 'block', xs: 'none' }}}>
              <Container sx={{ display: { lg: 'block', md: 'block', xs: 'none' }, maxWidth: 'sm' }}>
                <EventsView handleAddEventClick={handleAddEventClick} />
              </Container>
            </Grid>
          </Grid>
          <Drawer sx={{ display: { lg: 'none', md: 'none', xs: 'block' } }} anchor="bottom" open={showSidePanel} onClose={() => setShowSidePanel(false)}>
            <EventsView handleAddEventClick={handleAddEventClick} />
          </Drawer>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
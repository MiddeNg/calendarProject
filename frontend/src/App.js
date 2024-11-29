import React, { useState, useEffect } from 'react';
import './App.css';
import {Login, logout } from './Login';
import Calendar from './Calendar';
import Drawer from '@mui/material/Drawer';
import EventsView from './EventsView';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';

const App = () => {
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(null);
  const [showSidePanel, setShowSidePanel] = useState(false);

  useEffect(() => {
    if (date) {
      setShowSidePanel(true);
    } else {
      setShowSidePanel(false);
    }
  }, [date]);
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="app">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Calendar
          </Typography>
          {user && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {!user && <Login setUser={setUser} />}
      <div className={`main-content ${user ? 'active' : 'inactive'}`}>
        <Grid container spacing={2}>
          <Grid item xs={12} size={7}>
            <Calendar setDate={setDate} />
          </Grid>
          <Grid item xs={0} size={5} sx={{ display: { lg: 'block', md: 'block', xs: 'none' } }}>
            <Container sx={{ display: { lg: 'block', md: 'block', xs: 'none' }, maxWidth: 'sm' }}>
              <EventsView user={user} selectedDate={date}  />
            </Container>
          </Grid>
        </Grid>
        <Drawer sx={{ display: { lg: 'none', md: 'none', xs: 'block' } }} anchor="bottom" open={showSidePanel} onClose={() => setShowSidePanel(false)}>
          <EventsView user={user} selectedDate={date} />
        </Drawer>
      </div>
    </div>
  );
};

export default App;

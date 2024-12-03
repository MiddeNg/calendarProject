import React, { useState, useEffect } from 'react';
import './App.css';
import {Login, logout } from './Login';
import Calendar from './Calendar';
import Drawer from '@mui/material/Drawer';
import EventsView from './EventsView';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { getRedirectResult } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
const App = () => {
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  React.useEffect(() => {
    const debugRedirectResult = async () => {
      try {
        const result = await getRedirectResult(getAuth());
        console.log(result)
        if (result && result.user) {
          setUser(result.user);
        }
      } catch (error) {
        console.log(error) // Debug errors from redirect response
      }
    }
    debugRedirectResult()
  }, [])
    useEffect(() => {
    setShowSidePanel(user && date);
  }, [date, user]);
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
          <Grid item xs={12} size={5.5}>
            <Calendar date={date} setDate={setDate} openSidePanel={() => setShowSidePanel(true)} />
          </Grid>
          <Grid item xs={0} size={0.75} sx={{ display: { lg: 'block', md: 'block', xs: 'none' }}}></Grid>
          <Grid item xs={0} size={5} sx={{ display: { lg: 'block', md: 'block', xs: 'none' } }}>
              <EventsView user={user} selectedDate={date} toggleEventsView={() => setShowSidePanel(false)} />
          </Grid>
        </Grid>
        <Drawer
          sx={{
            display: { lg: 'none', md: 'none', xs: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              overflow: 'hidden',
              height: '85vh',
              backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? '#fff' : '#121212',
              padding: 1,
              borderRadius: 2,
            },
          }}
          anchor="bottom"
          open={showSidePanel}
          onClose={() => setShowSidePanel(false)}
        >
          <EventsView user={user} selectedDate={date} toggleEventsView={() => setShowSidePanel(false)}/>
        </Drawer>
      </div>
    </div>
  );
};

export default App;

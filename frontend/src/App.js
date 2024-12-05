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

function getWindowSize() {
  switch (true) {
    case window.innerWidth < 576:
      return 'sm';
    case window.innerWidth < 768: 
      return 'md';
    case window.innerWidth < 992:
      return 'lg';
    default:
      return 'xl';
  }
}
const App = () => {
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(null);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const scrollEventListRef = React.useRef(null);

  const onCalendarClick = (selectedDate) => {
    console.log(scrollEventListRef.current)
    scrollEventListRef.current && scrollEventListRef.current.scrollToListItem(selectedDate);
    setDate(selectedDate);
  }

  useEffect(() => {
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
    setShowSidePanel((user && date) ? true : false);
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
          <Grid sm={12} size={5.5}>
            <Calendar date={date} onCalendarClick={onCalendarClick} openSidePanel={() => setShowSidePanel(true)} />
          </Grid>
          <Grid sm={0} size={0.75}></Grid>
          {getWindowSize() !== 'sm' && (<Grid size={5}>
              <EventsView logined={!!user} selectedDate={date} toggleEventsView={() => setShowSidePanel(false)} 
                ref={scrollEventListRef}
              />
          </Grid>)}
        </Grid> 
        {getWindowSize() === 'sm' && <Drawer 
          sx={{
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
          keepMounted={true} //import for scrolling to work
        >
          <EventsView logined={!!user} selectedDate={date} toggleEventsView={() => setShowSidePanel(false)} 
            ref={scrollEventListRef}
          />
        </Drawer>}
      </div>
    </div>
  );
};

export default App;

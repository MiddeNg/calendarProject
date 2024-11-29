import React, { useState } from 'react';
import { List, Button, Paper, Typography } from '@mui/material';
import CreateEventView from './CreateEventView';
import Event from './Event';
import backend from './firebaseBackend';

const EventsView = ({ user, selectedDate }) => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const fetchEvents = async () => {
      try{
        const events = await backend.getAllEvents();
        setEvents(events);
      } catch(error) {
        setError(error.message ?? error.statusText ?? 'Failed to fetch events. Please try again.');
      }
    };
    user && fetchEvents();
  }, [user]);

  const handleAddEventClick = async(event) => {
    await backend.createEvent(event);
    setEvents([...events, event]);
    setShowCreateEvent(false);
  };

  return (
    <Paper style={{
      borderRadius: '20px', padding: '20px',
      margin: '20px', width: '80%', maxWidth: '600px',
      height: '100%',
    }}>
      {showCreateEvent ? (
        <CreateEventView
          handleAddEventClick={handleAddEventClick}
          showEvents={() => setShowCreateEvent(false)} 
          selectedDate={selectedDate}
        />
      ) : (
        <>
          <Button onClick={() => setShowCreateEvent(true)} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
            Add Event
          </Button>
          <List style={{ marginTop: '10px' }}>
            {error ? <Typography color="error">{error}</Typography> : events.map((event, index) => (
              <Event key={index} event={event} onEditClick={() => setShowCreateEvent(true)} />
            ))}
          </List>
        </>
      )}
    </Paper>
  );
};

export default EventsView;

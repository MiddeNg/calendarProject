import React, { useState } from 'react';
import { List, ListItem, ListItemText, Button, Paper } from '@mui/material';
import CreateEventView from './CreateEventView';
import Event from './Event';

const EventsView = ({ uploadEvent, selectedDate }) => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const events = [];

  const handleAddEventClick = (event) => {
    uploadEvent(event);
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
          <List>
            {events.map((event, index) => (
              <Event key={index} {...event} />
            ))}
          </List>
        </>
      )}
    </Paper>
  );
};

export default EventsView;
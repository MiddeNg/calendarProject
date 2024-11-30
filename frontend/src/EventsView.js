import React, { useState, useEffect } from 'react';
import { List, Button, Paper, Typography } from '@mui/material';
import CreateEventView from './CreateEventView';
import Event from './Event';
import backend from './firebaseBackend';
import dayjs from 'dayjs';
import { ImportAndExport } from './ExportCSV';

const EventsView = ({ user, selectedDate }) => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showExportView, setShowExportView] = useState(false);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [error, setError] = useState('');
  const dateRef = React.createRef();

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await backend.getAllEvents();
        const groupedEvents = events.reduce((acc, event) => {
          const startDate = event.startDateTime.format('YYYY-MM-DD');
          if (!acc[startDate]) {
            acc[startDate] = [];
          }
          acc[startDate].push(event);
          return acc;
        }, {})
        setGroupedEvents(groupedEvents);
      } catch (error) {
        setError(error.message ?? error.statusText ?? 'Failed to fetch events. Please try again.');
      }
    };
    user && fetchEvents();
  }, [user]);

  useEffect(() => {
    if (selectedDate && dateRef.current) {
      const divs = dateRef.current.querySelectorAll('div.dateCard');
      const selectedDateStart = selectedDate.startOf('day');
      const divToShow = Object.values(divs).find((div) => {
        const key = div.getAttribute('data-key')
        return dayjs(key).isSame(selectedDateStart) || dayjs(key).isAfter(selectedDateStart)
      }) ?? divs.length > 0 ? divs[divs.length - 1] : null;
      if (divToShow) {
        divToShow.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedDate, dateRef]);

  const handleAddEventClick = async (event) => {
    await backend.createEvent(event);
    console.log("event", groupedEvents[event.startDateTime.format('YYYY-MM-DD')])
    setGroupedEvents(prevState => ({ ...prevState, [event.startDateTime.format('YYYY-MM-DD')]: [...prevState[event.startDateTime.format('YYYY-MM-DD')] ?? [], event] }));
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
      ) : showExportView ? <ImportAndExport events={groupedEvents} setEvents={setGroupedEvents} toggleExportView={() => setShowExportView(false)} /> : (
        <>
          <Button onClick={() => setShowCreateEvent(true)} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
            Add Event
          </Button>
          <Button onClick={() => setShowExportView(true)} variant="contained" color="primary" style={{ marginBottom: '10px' }}>
            Export Events
          </Button>
          <div style={{ maxHeight: '600px', overflowY: 'auto', marginTop: '10px' }}>
            <List ref={dateRef}>
              {error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                Object.entries(groupedEvents).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([date, events]) => (
                <div key={date} data-key={date} className='dateCard'>
                  <Typography variant="h6">{date} </Typography>
                  {events.map((event, index) => (
                    <Event key={index} event={event} onEditClick={() => setShowCreateEvent(true)} />
                  ))}
                </div>
              )))}
            </List>
          </div>
        </>
      )}
    </Paper>
  );
};

export default EventsView;

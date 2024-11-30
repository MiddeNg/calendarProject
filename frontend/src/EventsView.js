import React, { useState, useEffect } from 'react';
import { List, Button, Typography, Paper } from '@mui/material';
import { Add, ArrowBack, FileUpload } from '@mui/icons-material';
import CreateEventView from './CreateEventView';
import Event from './Event';
import backend from './firebaseBackend';
import dayjs from 'dayjs';
import { ImportAndExport } from './ExportCSV';
import Grid from '@mui/material/Grid2';
const EventsView = ({ user, selectedDate, toggleEventsView }) => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showExportView, setShowExportView] = useState(false);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [error, setError] = useState('');
  const dateRef = React.createRef();

  useEffect(() => {
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
        }, {});
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
        const key = div.getAttribute('data-key');
        return dayjs(key).isSame(selectedDateStart) || dayjs(key).isAfter(selectedDateStart);
      }) ?? (divs.length > 0 ? divs[divs.length - 1] : null);
      if (divToShow) {
        divToShow.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedDate, dateRef]);

  const handleAddEventClick = async (event) => {
    await backend.createEvent(event);
    setGroupedEvents(prevState => ({ ...prevState, [event.startDateTime.format('YYYY-MM-DD')]: [...prevState[event.startDateTime.format('YYYY-MM-DD')] ?? [], event] }));
    setShowCreateEvent(false);
  };
  const onEditClick = (event) => {
    
  }
  return (
    <Paper style={{
      borderRadius: '20px', padding: '20px',
      margin: '10px', width: '100%', maxWidth: '600px',
      height: '80vh',
    }}>
      {showCreateEvent ? (
        <CreateEventView
          handleAddEventClick={handleAddEventClick}
          showEvents={() => setShowCreateEvent(false)}
          selectedDate={selectedDate}
        />
      ) : showExportView ? <ImportAndExport events={groupedEvents} setEvents={setGroupedEvents} toggleExportView={() => setShowExportView(false)} /> : (
        <>
          <Grid container spacing={1} style={{ marginBottom: '10px' }}>
            <Grid item size={5}>
              <Button onClick={toggleEventsView} variant="contained" color="primary">
                <ArrowBack />
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => setShowCreateEvent(true)} variant="contained" color="primary">
                <Add />
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => setShowExportView(true)} variant="contained" color="primary">
                <FileUpload />
              </Button>
            </Grid>
          </Grid>
          <div style={{ maxHeight: '70vh', overflowY: 'auto', marginTop: '10px' }}>
            <List ref={dateRef}>
              {error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                Object.entries(groupedEvents).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([date, events]) => (
                  <div key={date} data-key={date} className='dateCard'>
                    <Typography variant="h6">{date} </Typography>
                    {events.map((event, index) => (
                      <Event key={index} event={event} onEditClick={onEditClick} />
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


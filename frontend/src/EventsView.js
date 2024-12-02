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
  const [editMode, setEditMode] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
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
    let eventId = await backend.createEvent(event);
    event.id = eventId;
    setGroupedEvents(prevState => ({
      ...prevState,
      [event.startDateTime.format('YYYY-MM-DD')]: [...prevState[event.startDateTime.format('YYYY-MM-DD')] ?? [], event]
    }));
    setShowCreateEvent(false);
    setEditMode(false);
    setEventToEdit(null);
  };

  const onEditClick = (event) => {
    setEventToEdit(event);
    setEditMode(true);
    setShowCreateEvent(true);
  };

  const saveEditedEvent = async (event) => {
    await backend.updateEvent(event);
    setGroupedEvents(prevState => {
      const newEvents = { ...prevState };
      newEvents[event.startDateTime.format('YYYY-MM-DD')] = newEvents[event.startDateTime.format('YYYY-MM-DD')] ?? [];
      const index = newEvents[event.startDateTime.format('YYYY-MM-DD')].findIndex(e => e.id === event.id);
      if (index > -1) {
        newEvents[event.startDateTime.format('YYYY-MM-DD')][index] = event;
      }
      return newEvents;
    });
    setShowCreateEvent(false);
    setEditMode(false);
    setEventToEdit(null);
  };
  return (
    <Paper
      style={{
        width: '95%',
        borderRadius: '3%', paddingLeft: '3%', paddingTop: '3%',
        height: '80vh',
      }}
      sx={{ margin: { lg: '3%' } }}>
      {showCreateEvent ? (
        <CreateEventView
          handleAddEventClick={handleAddEventClick}
          showEvents={() => {
            setShowCreateEvent(false);
            setEditMode(false);
            setEventToEdit(null);
          }}
          selectedDate={selectedDate}
          editModeBoolean={editMode}
          originalEvent={eventToEdit}
          saveEditedEvent={saveEditedEvent}
        />
      ) : showExportView ? <ImportAndExport events={groupedEvents} setEvents={setGroupedEvents} toggleExportView={() => setShowExportView(false)} /> : (
        <>
          <Grid container spacing={1} style={{ marginBottom: '10px' }}>
            <Grid item size={5}>
              <Button onClick={toggleEventsView} variant="contained" color="primary"
                sx={{ display: { md: 'none', lg: 'none' } }}
              >
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


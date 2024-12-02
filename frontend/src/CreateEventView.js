import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker  } from '@mui/x-date-pickers/DateTimePicker';
import { Alert, FormControlLabel, Switch } from '@mui/material';

function CreateEventView({ handleAddEventClick, showEvents, selectedDate, editModeBoolean, originalEvent, saveEditedEvent }) {
  const [newEvent, setNewEvent] = useState(editModeBoolean ? originalEvent : {
    name: '',
    description: '',
    startDateTime: selectedDate ? selectedDate.startOf('day') : null,
    endDateTime: selectedDate ? selectedDate.startOf('day').add(1, 'day') : null,
    isFullDay: false,
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (selectedDate) {
      setNewEvent((prevState) => ({
        ...prevState,
        startDateTime: selectedDate,
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (editModeBoolean) {
      setNewEvent((originalEvent)); 
    }
  }, [editModeBoolean, originalEvent]);

  const handleStartDateTimeChange = (value) => {
    setNewEvent({ ...newEvent, startDateTime: value });
  };

  const handleEndDateTimeChange = (value) => {
    setNewEvent({ ...newEvent, endDateTime: value });
  };
  const handleFullDayToggle = () => {
    if (newEvent.isFullDay) {
      setNewEvent({
        ...newEvent,
        isFullDay: false,
        endDateTime: null,
      });
    } else {
      setNewEvent({
        ...newEvent,
        isFullDay: true,
        startDateTime: newEvent.startDateTime ? newEvent.startDateTime.startOf('day') : null,
        endDateTime: newEvent.startDateTime ? newEvent.startDateTime.set('hour', 23).set('minute', 59).set('second', 59).set('millisecond', 999) : null,
      });
    }
  };

  const handleAddClick = () => {
    if (!newEvent.name  || !newEvent.startDateTime || !newEvent.endDateTime) {
      setErrorMessage('Please fill in required fields.');
      return;
    }
    handleAddEventClick(newEvent);
    // Clear the input fields after adding the event
    setNewEvent({
      name: '',
      description: '',
      startDateTime: null,
      endDateTime: null,
      isFullDay: false,
    });
  };

  return (
    <List>
      {errorMessage && <Alert severity="error" className="mt-3">{errorMessage}</Alert>}
      <ListItem>
        <TextField
          required
          label="Name"
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
        />
      </ListItem>
      <ListItem>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker 
            renderInput={(props) => <TextField {...props} required />}
            label="Start"
            value={newEvent.startDateTime}
            onChange={handleStartDateTimeChange}
          />
        </LocalizationProvider>
      </ListItem>
      <ListItem>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker 
            renderInput={(props) => <TextField {...props} required disabled={newEvent.isFullDay} />}
            label="End"
            minDateTime={newEvent.startDateTime}
            value={newEvent.endDateTime}
            onChange={handleEndDateTimeChange}
          />
        </LocalizationProvider>
      </ListItem>
      <ListItem>
        <FormControlLabel
          control={<Switch checked={newEvent.isFullDay} onChange={handleFullDayToggle} />}
          label="All-day Event"
        />
      </ListItem>
      <ListItem>
        <TextField
          label="Description"
          multiline
          rows={4}
          style={{ overflow: 'auto', width: '80vw' }}
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        />
      </ListItem>
      <ListItem>
        <Button variant="contained" onClick={editModeBoolean ? () => saveEditedEvent(newEvent) : handleAddClick} disabled={editModeBoolean && JSON.stringify(originalEvent) === JSON.stringify(newEvent)} style={{ marginRight: '10px' }}>Save</Button>
        <Button variant="contained" onClick={showEvents}>Cancel</Button>
      </ListItem>
    </List>
  );
}

export default CreateEventView;

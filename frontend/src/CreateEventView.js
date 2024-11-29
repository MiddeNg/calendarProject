import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormControlLabel, Switch } from '@mui/material';
import dayjs from 'dayjs';

function CreateEventView({ handleAddEventClick }) {
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    startDateTime: dayjs(),
    endDateTime: null,
    isFullDay: false,
  });

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
      <ListItem>
        <TextField
          label="Name"
          value={newEvent.name}
          onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
        />
      </ListItem>
      <ListItem>
        <TextField
          label="Description"
          value={newEvent.description}
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        />
      </ListItem>
      <ListItem>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="Start Date and Time"
            value={newEvent.startDateTime}
            onChange={handleStartDateTimeChange}
          />
        </LocalizationProvider>
      </ListItem>
      <ListItem>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="End Date and Time"
            value={newEvent.endDateTime}
            onChange={handleEndDateTimeChange}
            disabled={newEvent.isFullDay}
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
        <Button variant="contained" onClick={handleAddClick}>Add Event</Button>
      </ListItem>
    </List>
  );
}

export default CreateEventView;
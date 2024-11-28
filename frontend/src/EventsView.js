import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

function EventsView({ handleAddEventClick }) {
  return (
    <List>
      <ListItem button onClick={handleAddEventClick}>
        <ListItemText primary="Add Event" />
      </ListItem>
    </List>
  );
}

export default EventsView
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { Button, DialogActions } from '@mui/material';

function CustomActionBar(props) {
  const { onSetToday, className } = props;
  return (
    <DialogActions className={className}>
      <Button onClick={()=> {
        onSetToday();
        props.openSidePanel();
      }}>Today</Button>
      <Button sx={{ display: { lg: 'none' } }} onClick={props.openSidePanel}>Show Events</Button>
    </DialogActions>
  );
}

function Calendar({ date, onCalendarClick, openSidePanel }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <StaticDatePicker
          value={date}
          onChange={(date) => {
            onCalendarClick(date)
          }}
          slots={{
            actionBar: CustomActionBar,
          }}
          slotProps={{
            actionBar: ({ wrapperVariant }) => ({
              actions: wrapperVariant === 'mobile' ? [] : ['today'],
              openSidePanel,
            })
          }}
        />

      </div>
    </LocalizationProvider>
  );
}

export default Calendar;

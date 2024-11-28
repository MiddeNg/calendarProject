import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers';

function Calendar({setDate}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div>
      <h1>Calendar</h1>
      <StaticDatePicker onChange={(date) => {
        console.log("date", date)
        setDate(date)}}/>
    </div>
    </LocalizationProvider>
  );
}

export default Calendar;
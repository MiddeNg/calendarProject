import React from 'react';
import { Button, Typography, Alert } from '@mui/material';
import Papa from 'papaparse';
import dayjs from 'dayjs';

export const ImportAndExport = ({ events, setEvents, toggleExportView }) => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const handleImportFromCsv = (e) => {
    if (e.target.files.length === 0) {
      setErrorMessage('No file selected');
      return;
    };
    if (e.target.files[0].type !== 'text/csv') {
      setErrorMessage('Invalid file type. Please select a CSV file.');
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const csv = e.target.result;
      const results = Papa.parse(csv, { header: true });
      if (results.errors.length > 0) {
        setErrorMessage(results.errors.map(e => e.message).join('\n'));
        return;
      }
      const eventsFromCsv = results.data.map(row => ({
        name: row.Name,
        description: row.Description,
        startDateTime: dayjs(row.Start),
        endDateTime: dayjs(row.End),
        isFullDay: row.FullDay === 'Yes',
      }));
      // setEvents(prevState => ({
      //   ...prevState,
      //   ...eventsFromCsv.reduce((acc, event) => {
      //     const startDate = event.startDateTime.format('YYYY-MM-DD');
      //     if (!acc[startDate]) {
      //       acc[startDate] = [];
      //     }
      //     acc[startDate].push(event);
      //     return acc;
      //   }, {})
      // }));
      console.log(eventsFromCsv)
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Button onChange={(e) => {
        setErrorMessage('');
        handleImportFromCsv(e)
        }} variant="contained" color="secondary"  style={{ marginBottom: '10px', marginLeft: '10px' }} component="label">
        <input type="file" accept=".csv" hidden />
        <Typography variant="button">Import from CSV</Typography>
      </Button>
      <Button onClick={() => {
        setErrorMessage('');
        exportToCsv(events)
      }} variant="contained" color="secondary" style={{ marginBottom: '10px', marginLeft: '10px' }}>
        Export to CSV
      </Button>
      <Button onClick={toggleExportView} variant="contained" color="secondary" style={{ marginBottom: '10px', marginLeft: '10px' }}>
        Cancel
      </Button>
      {errorMessage && <Alert severity="error" style={{ marginTop: '10px' }}>{errorMessage}</Alert>}
    </>
  );
};

const exportToCsv = (groupedEvents) => {
  const csvData = [];
  Object.entries(groupedEvents).forEach(([date, events]) => {
    events.forEach(event => {
      csvData.push({
        Name: event.name,
        Description: event.description,
        Start: event.startDateTime.format('YYYY-MM-DD HH:mm'),
        End: event.endDateTime.format('YYYY-MM-DD HH:mm'),
        FullDay: event.isFullDay ? 'Yes' : 'No'
      });
    });
  });
  const csvContent = 'data:text/csv;charset=utf-8,' +
    ['Name,Description,Start,End,FullDay']
      .concat(csvData.map(e => Object.values(e).join(',')))
      .join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'events.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


import React from 'react';
import { Button, Typography, Alert, Box } from '@mui/material';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import backend from './firebaseBackend';

export const ImportAndExport = ({ events, refetchEvents, toggleExportView }) => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [noOfEventsUploaded, setNoOfEventsUploaded] = React.useState(0);
  const [noOfEventsUpdated, setNoOfEventsUpdated] = React.useState(0);

  const handleImportEvent = async (newEvents, dupilcateEvents) => {
    try {
      await backend.updateBatchEvents(newEvents, dupilcateEvents)
      setNoOfEventsUploaded(newEvents.length)
      setNoOfEventsUpdated(dupilcateEvents.length)
      setShowSuccessMessage(true);  
    } catch (error) {
      console.log(' updateBatchEvents error', error)
      setErrorMessage('Failed to update events. Please try again.');
    }
    // setEvents(prevState => eventsFromCsv.reduce((acc, event) => {
    //     const startDate = event.startDateTime.format('YYYY-MM-DD');
    //     if (!acc[startDate]) {
    //       acc[startDate] = [];
    //     }
    //     const idx = acc[startDate].findIndex(e => e.id === event.id);
    //     if (idx === -1) {
    //       //the event could be in other days
    //       Object.entries(acc).forEach(([date, events]) => {
    //         let idx = events.findIndex(e => e.id === event.id)
    //         if (idx > -1) {
    //           acc[date].splice(idx, 1);
    //         }
    //       })
    //       acc[startDate].push(event);
    //     } else {
    //       acc[startDate][idx] = event;
    //     }
    //     return acc;
    //   }, {...prevState})
    // );
  }
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
      const header = Object.keys(results.data[0]);
      const requiredHeaders = ['Id', 'Name', 'Description', 'Start', 'End', 'FullDay'];
      if (requiredHeaders.some(h => !header.includes(h))) {
        setErrorMessage('Invalid CSV file. Missing required fields.');
      }
      const eventsFromCsv = results.data.map(row => ({
        id: row.Id,
        name: row.Name,
        description: row.Description.replace('\\n', '\n'), // unescape newlines
        startDateTime: dayjs(row.Start),
        endDateTime: dayjs(row.End),
        isFullDay: row.FullDay === 'Yes',
      }));
      const oldEventsKeys = [].concat(...Object.values(events)).map(e => e.id);
      const newEvents = []
      const dupilcateEvents = eventsFromCsv.reduce((acc, event) => {
        if (oldEventsKeys.includes(event.id)) {
          acc.push(event);
        } else {
          newEvents.push(event);
        }
        return acc
      }, [])
      handleImportEvent(newEvents, dupilcateEvents)
    };
    reader.readAsText(file);
  };

  return (
    <>
      {!showSuccessMessage && <div>
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
          Return
        </Button>
      </div>}
      {errorMessage && <Alert severity="error" style={{ marginTop: '10px' }}>{errorMessage}</Alert>}
      {showSuccessMessage && (
        <Box style={{ marginTop: '10px' }}>
          <Typography variant="h6" >Successfully uploaded from csv!</Typography>
          <Typography variant="h6" >{`
          No. of events uploaded: ${noOfEventsUploaded}`}</Typography>
          <Typography variant="h6" >{`
          No. of events updated: ${noOfEventsUpdated}`}</Typography>
          <Button onClick={refetchEvents} variant="contained" color="secondary" style={{ marginTop: '10px', marginLeft: '10px' }}>
            Return to list view 
          </Button>
        </Box>
      )}
      <Typography variant="h6" style={{ marginTop: '10px' }}>
        Note that import csv events will overwrite existing events.
      </Typography>
    </>
  );
};

const exportToCsv = (groupedEvents) => {
  const csvData = [];
  Object.entries(groupedEvents).forEach(([date, events]) => {
    console.log("events", events)
    events.forEach(event => {
      csvData.push({
        Id: event.id,
        Name: event.name,
        Description: `"${event.description}"`, // escape commas
        Start: event.startDateTime.format('YYYY-MM-DD HH:mm'),
        End: event.endDateTime.format('YYYY-MM-DD HH:mm'),
        FullDay: event.isFullDay ? 'Yes' : 'No'
      });
    });
  });
  const csvContent = 'data:text/csv;charset=utf-8,' +
    ['Id,Name,Description,Start,End,FullDay']
      .concat(csvData.map(e => {
        return Object.values(e)
        .join(',')
        .replace('\n', '\\n') // escape newlines
      }))
      .join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'events.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


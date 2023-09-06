import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function Calendar() {
  const GET_ALL_URL = 'https://traineeapp.azurewebsites.net/gettrainings';
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const trainingsResponse = await fetch(GET_ALL_URL);
        const trainingsData = await trainingsResponse.json();

        const formattedTrainings = trainingsData.map((training) => {
          const customer = training.customer;
          const title = customer
            ? `${training.activity} / ${customer.firstname} ${customer.lastname}`
            : `${training.activity} / Unknown Customer`;

          const startTime = new Date(training.date);
          const endTime = new Date(startTime.getTime() + training.duration * 60000);

          return {
            title,
            start: startTime,
            end: endTime,
            ...training, // Add all training data to the event object
          };
        });

        setTrainings(formattedTrainings);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrainings();
  }, []);

  const handleDateClick = (info) => {
    console.log('Clicked on date:', info.dateStr);
  };

  const handleEventClick = (info) => {
    setSelectedTraining(info.event);
  };

  const handleClose = () => {
    setSelectedTraining(null);
  };

  return (
    <div className="calendar">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={trainings}
        dateClick={handleDateClick}
        eventClick={handleEventClick} // Add eventClick callback
      />

      {/* Show selected training in a dialog */}
      <Dialog open={selectedTraining !== null} onClose={handleClose}>
        <DialogTitle>{selectedTraining?.title}</DialogTitle>
        <DialogTitle>{selectedTraining?.extendedProps.title}</DialogTitle>
        <DialogContent>
          <p>Date: {selectedTraining ? selectedTraining.start.toLocaleDateString() : ''}</p>
          <p>Duration: {selectedTraining ? ((selectedTraining.end - selectedTraining.start) / 60000).toFixed() : ''} minutes</p>
          <p>Activity: {selectedTraining?.extendedProps.activity}</p>
          {selectedTraining?.extendedProps.customer && (
            <>
              <p>Customer: {selectedTraining.extendedProps.customer.firstname} {selectedTraining.extendedProps.customer.lastname}</p>
              <p>Email: {selectedTraining.extendedProps.customer.email}</p>
              <p>Phone: {selectedTraining.extendedProps.customer.phone}</p>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Calendar;

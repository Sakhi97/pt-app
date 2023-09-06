import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

export default function AddTraining(props) {
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    date: null,
    activity: "",
    duration: "",
    customer: "",
  });

  const handleClickOpen = () => {
    setTraining({
      date: props.date,
      activity: props.activity,
      duration: props.duration,
      customer: props.customer,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (date) => {
    const newDate = dayjs(training.date).set("date", date.date()).set("month", date.month()).set("year", date.year());
    setTraining({ ...training, date: newDate.toISOString() });
  };

  const handleTimeChange = (newValue) => {
    if (newValue) {
      setTraining({ ...training, date: newValue.toISOString() });
    } else {
      setTraining({ ...training, date: null });
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTraining({ ...training, [name]: value });
  };

  const updateTraining = () => {
    const newTraining = {
      date: dayjs(training.date).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'),
      activity: training.activity,
      duration: parseInt(training.duration, 10),
      customer: training.customer,
    };

    console.log('newTraining:', newTraining); 

    props.saveTraining(newTraining);
    handleClose();
  };
  

  return (
    <div>
      <Button onClick={handleClickOpen}>Add training</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add training</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dayjs(training.date)}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
              format="DD.MM.YY"
            />
            <TimePicker
              value={dayjs(training.date)}
              onChange={handleTimeChange}
              renderInput={(params) => <TextField {...params} />}
              format="HH:mm"
            />
          </LocalizationProvider>
          <TextField
            margin="dense"
            name="activity"
            value={training.activity}
            onChange={handleInputChange}
            label="activity"
            fullWidth
          />
          <TextField
            margin="dense"
            name="duration"
            value={training.duration}
            onChange={handleInputChange}
            label="duration"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={updateTraining}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}





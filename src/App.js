import './App.css';
import CustomerList from './components/Customerlist';
import TrainingList from './components/Traininglist';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { Link, Route, Routes, BrowserRouter } from 'react-router-dom';

function App() {
  const [value, setValue] = useState('/');
 


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">PERSONAL TRAINING APP</Typography>
          </Toolbar>
          </AppBar>
          <Tabs value={value} onChange={handleChange}>
            <Tab value="/" label="Customer List" component={Link} to="/"  />
            <Tab value="/traininglist" label="Training List" component={Link} to="/traininglist" />
          </Tabs>
       
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/traininglist" element={<TrainingList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;



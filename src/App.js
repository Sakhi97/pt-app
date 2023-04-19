import './App.css';
import Customerlist from './components/Customerlist';
import Traininglist from './components/Traninglist';
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
          <Tabs value={value} onChange={handleChange}>
            <Tab value="/" label="Customer List" component={Link} to="/"  />
            <Tab value="/traininglist" label="Training List" component={Link} to="/traininglist" />
          </Tabs>
        </AppBar>
        <Routes>
          <Route path="/" element={<Customerlist />} />
          <Route path="/traininglist" element={<Traininglist />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;



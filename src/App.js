import './App.css';
import CustomerList from './components/Customerlist';
import TrainingList from './components/Traininglist';
import Calendar from './components/Calendar';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useState, useEffect } from 'react';
import { Link, Route, Routes, BrowserRouter, useLocation } from 'react-router-dom';

function MainContent() {
  const [value, setValue] = useState('/');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  useEffect(() => {
    setValue(location.pathname);
  }, [location]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            PERSONAL TRAINING APP
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <div
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/calendar">
              <ListItemText primary="Calendar" />
            </ListItem>
            
          </List>
        </div>
      </Drawer>
      {location.pathname !== '/calendar' && (
        <Tabs value={value} onChange={handleChange}>
          <Tab value="/" label="Customer List" component={Link} to="/" />
          <Tab value="/traininglist" label="Training List" component={Link} to="/traininglist" />
        </Tabs>
      )}
      <div className="content">
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/traininglist" element={<TrainingList />} />
          <Route path="/calendar" element={<div className="calendar"><Calendar /></div>} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <MainContent />
      </BrowserRouter>
    </div>
    
  );
}

export default App;

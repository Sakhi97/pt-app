import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';

export default function EditCustomer(props) {
  const { updateCustomer, params } = props;
  const [open, setOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState({
    firstname: '',
    lastname: '',
    streetaddress: '',
    postcode: '',
    city: '',
    email: '',
    phone: ''
  });

  const handleClickOpen = () => {
    setCustomer({
      firstname: params.firstname,
      lastname: params.lastname,
      streetaddress: params.streetaddress,
      postcode: params.postcode,
      city: params.city,
      email: params.email,
      phone: params.phone
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    updateCustomer(customer, params.links[0].href);
    setOpen(false);
  };

  return (
    <div>
      <Button size="small" onClick={handleClickOpen}>
        <EditIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <TextField
            value={customer.firstname}
            onChange={e => setCustomer({...customer, firstname: e.target.value})}
            margin="dense"
            label="First Name"
            fullWidth
            variant="standard"
          />
          <TextField
            value={customer.lastname}
            onChange={e => setCustomer({...customer, lastname: e.target.value})}
            margin="dense"
            label="Last Name"
            fullWidth
            variant="standard"
          />
          <TextField
            value={customer.streetaddress}
            onChange={e => setCustomer({...customer, streetaddress: e.target.value})}
            margin="dense"
            label="Street Address"
            fullWidth
            variant="standard"
          />
          <TextField
            value={customer.postcode}
            onChange={e => setCustomer({...customer, postcode: e.target.value})}
            margin="dense"
            label="Post Code"
            fullWidth
            variant="standard"
          />
          <TextField
            value={customer.city}
            onChange={e => setCustomer({...customer, city: e.target.value})}
            margin="dense"
            label="City"
            fullWidth
            variant="standard"
          />
          <TextField
            value={customer.email}
            onChange={e => setCustomer({...customer, email: e.target.value})}
            margin="dense"
            label="Email"
            fullWidth
            variant="standard"
          />
          <TextField
            value={customer.phone}
            onChange={e => setCustomer({...customer, phone: e.target.value})}
            margin="dense"
            label="Phone"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

EditCustomer.propTypes = {
    updateCustomer: PropTypes.func.isRequired,
    params: PropTypes.shape({
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      streetaddress: PropTypes.string,
      postcode: PropTypes.string,
      city: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      links: PropTypes.arrayOf(PropTypes.shape({
        href: PropTypes.string
      }))
    }).isRequired
  };
  
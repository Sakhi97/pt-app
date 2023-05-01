import React, { useState, useEffect } from "react";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import { Box } from '@mui/material';
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import AddTraining from "./AddTraining";
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState();
  const API_URL = 'https://traineeapp.azurewebsites.net/api';

  const [columnDefs] = useState([
    { headerName: "First Name", field: "firstname", sortable: true, filter: true, width: 140 },
    { headerName: "Last Name", field: "lastname", sortable: true, filter: true, width: 140 },
    { headerName: "Address", field: "streetaddress", sortable: true, filter: true, width: 140 },
    { headerName: "Post code", field: "postcode", sortable: true, filter: true, width: 120 },
    { headerName: "City", field: "city", sortable: true, filter: true, width: 120 },
    { headerName: "Email", field: "email", sortable: true, filter: true, width: 160 },
    { headerName: "Phone", field: "phone", sortable: true, filter: true, width: 160 },
    {
      field: "edit",
      headerName: "Edit",
      width: 70,
      disableExport: true,
      renderCell: (params) => <EditButtonCell {...params} />,
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 70,
      disableExport: true,
      renderCell: (params) => <DeleteButtonCell {...params} />,
    },
    {
      field: "addTraining",
      headerName: "Add Training",
      width: 140,
      disableExport: true,
      renderCell: (params) => <AddTrainingButtonCell {...params} />,
    },
  ]);

  function EditButtonCell(props) {
    return (
      <EditCustomer
        params={props.row}
        updateCustomer={updateCustomer}
      >
        <EditIcon />
      </EditCustomer>
    );
  }

  function DeleteButtonCell(props) {
    return (
      <Button
        size="small"
        color="error"
        onClick={() => deleteCustomer(props.row)}
      >
        <DeleteIcon />
      </Button>
    );
  }

  function AddTrainingButtonCell(props) {
    return (
      <AddTraining
        date={moment()}
        activity=""
        duration=""
        customer={props.row.links[1].href}
        saveTraining={addTrainingToCustomer}
      />
    );
  }

  const deleteCustomer = (row) => {
    if (window.confirm("Are you sure?")) {
      fetch(row.links[0].href, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            setMsg("Customer has been deleted successfully");
            setOpen(true);
            getCustomers();
            } else {
            alert("Something went wrong in deletion");
            }
            })
            .catch((err) => console.error(err));
            }
            };
            
            useEffect(() => {
            getCustomers();
            }, []);
            
            const getCustomers = () => {
            fetch(API_URL + '/customers')
            .then((response) => {
            if (response.ok) return response.json();
            else alert("Something went wrong in GET request");
            })
            .then((data) => setCustomers(data.content))
            .catch((err) => console.error(err));
            };
            
            const addCustomer = (customer) => {
            fetch(API_URL + '/customers', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(customer)
            })
            .then(response => {
            if (response.ok) {
            getCustomers();
            } else {
            alert('Something went wrong in addition: ' + response.statusText);
            }
            })
            .catch(err => console.error(err))
            }
            
            const addTraining = async (training) => {
            const response = await fetch(API_URL+'/trainings', {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(training),
            });
            const data = await response.json();
            console.log("API response:", data);
            if (response.ok) {
            setMsg("Training has been added successfully");
            setOpen(true);
            } else {
            setMsg("Error adding training");
            setOpen(true);
            }
            };
            
            const addTrainingToCustomer = async (training) => {
            await addTraining(training);
            getCustomers(); // Fetches updated customers data after adding a new training
            }
            
            const updateCustomer = (updatedCustomer, url) => {
            fetch(url, {
            method: 'PUT',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify(updatedCustomer)
            })
            .then(response => {
            if (response.ok) {
            setMsg("Customer has been edited successfully");
            setOpen(true);
            getCustomers();
            }
            else {
            alert('Something went wrong when editing');
            }
            })
            .catch(err => console.error(err))
            }
            
            function CustomToolbar() {
            return (
            <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
            </GridToolbarContainer>
            );
            }
            
            return (
            <>
            <AddCustomer addCustomer={addCustomer} />
            <Box display="flex" justifyContent="center" alignItems="center" width="100%">
    <Box width="95%">
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          components={{ Toolbar: CustomToolbar  }}
          rows={customers}
          columns={columnDefs}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pagination
          pageSize={10}
          pageSizeOptions={[5, 10, 15]}
          getRowId={(row) => row.email}
        />
      </div>
    </Box>
  </Box>
  <Snackbar
    open={open}
    message={msg}
    autoHideDuration={3000}
    onClose={() => setOpen(false)}
  />
</>
);
}

export default CustomerList;

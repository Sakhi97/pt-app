import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
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
  const API_URL = process.env.REACT_APP_API_URL;
 

  const [columnDefs] = useState([
    { headerName: "First Name", field: "firstname", sortable: true, filter: true, width: 140 },
    { headerName: "Last Name", field: "lastname", sortable: true, filter: true, width: 140 },
    { headerName: "Address", field: "streetaddress", sortable: true, filter: true, width: 140 },
    { headerName: "Post code", field: "postcode", sortable: true, filter: true, width: 120 },
    { headerName: "City", field: "city", sortable: true, filter: true, width: 120 },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    { headerName: "Phone", field: "phone", sortable: true, filter: true, width: 130 },
    {
      cellRenderer: params => (
        <EditCustomer
          params={params.data}
          updateCustomer={updateCustomer}
        >
          <EditIcon />
        </EditCustomer>
      ),
      width: 70
    },
    
    {
      cellRenderer: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => deleteCustomer(params)}
        >
          <DeleteIcon />
        </Button>
      ),
      width: 70,
    },
    

    {
        width: 140,
        cellRenderer: (params) => (
            <AddTraining
            date={moment()}
            activity=""
            duration=""
            customer={params.data.links[1].href}
            saveTraining={addTrainingToCustomer}
          />

        ),
      }

  ]);

  const deleteCustomer = (params) => {
    if (window.confirm("Are you sure?")) {
      fetch(params.data.links[0].href, { method: "DELETE" })
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
  

  const getCustomers = () => {
    fetch(API_URL+'/customers')
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

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <>
    <AddCustomer addCustomer={addCustomer} />
      <div
        className="ag-theme-material"
        style={{ width: "89%", height: 600, margin: "auto" }}
      >
        <AgGridReact
          rowData={customers}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
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




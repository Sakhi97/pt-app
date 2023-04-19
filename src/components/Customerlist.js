import React, {useState, useEffect} from "react";
import { AgGridReact } from 'ag-grid-react';


import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';


function Customerlist() {
    const [customers, setCustomers] = useState([]);
 

    // Set columns
    const [columnDefs] = useState([
        {headerName: "First Name", field: 'firstname', sortable: true, filter: true, width: 140},
        {headerName: "Last Name", field: 'lastname', sortable: true, filter: true, width: 140},
        {headerName: "Address", field: 'streetaddress', sortable: true, filter: true, width: 160},
        {headerName: "Post code",field: 'postcode', sortable: true, filter: true, width: 120},
        {headerName: "City", field: 'city', sortable: true, filter: true, width: 120},
        {headerName: "Email", field: 'email', sortable: true, filter: true},
        {headerName: "Phone", field: 'phone', sortable: true, filter: true, width: 160}
    ])

    

    const getCustomers = () => {
        fetch(`${process.env.REACT_APP_API_URL}/customers`)
        .then(response => {
            if(response.ok)
                return response.json();
            else
                alert('Something went wrong in GET request');
        })
        .then(data => setCustomers(data.content))
        .catch(err => console.error(err))
    }

   
   

    useEffect(() => {
        //Fetch customers (httpS)
        getCustomers();
    }, []);

    return (
        <>
            
            <div 
              className='ag-theme-material'
              style={{width:'80%', height:600, margin:'auto'}}>
              <AgGridReact
                //Where the data comes from: 
                rowData={customers}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={10}
              />
            </div>
        </>
    )
}

export default Customerlist;
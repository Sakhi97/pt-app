import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function TrainingList() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [trainings, setTrainings] = useState([]);
 

  const [columnDefs] = useState([
    {
      headerName: "Date",
      field: "date",
      sortable: true,
      filter: true,
      valueFormatter: (params) => dayjs(params.value).format("DD.MM.YYYY HH:mm"),
    },
    { headerName: "Duration", field: "duration", sortable: true, filter: true},
    { headerName: "Activity", field: "activity", sortable: true, filter: true},
    { headerName: "Customer", field: "customer", sortable: true, filter: true},
    {
      headerName: "Delete",
      field: "links",
      cellRendererFramework: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => deleteTraining(params)}
        >
          <DeleteIcon />
        </Button>
      ),
      width: 90,
    },
  ]);

  const deleteTraining = (params) => {
    if (window.confirm("Are you sure?")) {
      const url = params.data.links.find((link) => link.rel === "self").href;
      fetch(url, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            setTrainings((prevTrainings) =>
              prevTrainings.filter((t) => t.links[0].href !== url)
            );
          } else {
            alert("Something went wrong in deletion");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  
  const getTrainings = async () => {
    try {
      const response = await fetch(API_URL+'/trainings');
      if (!response.ok) {
        throw new Error("Error occurred in fetching trainings data");
      }
      const { content: data } = await response.json();
  
      const fetchCustomer = async (training) => {
        const customerUrl = training.links.find((link) => link.rel === "customer")?.href;
        const customerResponse = await fetch(customerUrl);
        if (!customerResponse.ok) {
          throw new Error("Could not fetch customer data for training");
        }
        return await customerResponse.json();
      };
  
      const trainingsWithCustomer = await Promise.all(
        data.map(async (training) => {
          const customerData = await fetchCustomer(training);
          const customer = `${customerData.firstname} ${customerData.lastname}`;
          return { ...training, customer };
        })
      );
  
      setTrainings(trainingsWithCustomer);
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
  };
  

  useEffect(() => {
    getTrainings();
  }, []);

  return (
    <>
      <div className="ag-theme-material" style={{ width: "65%", height: 600, margin: "auto" }}>
        <AgGridReact rowData={trainings} columnDefs={columnDefs} pagination={true} paginationPageSize={10} />
      </div>
    </>
  );
}

export default TrainingList;




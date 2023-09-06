import React, { useState, useEffect } from "react";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import Snackbar from "@mui/material/Snackbar";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

function TrainingList() {
  const API_URL = 'https://traineeapp.azurewebsites.net/api';
  const [trainings, setTrainings] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [columnDefs] = useState([
    {
      field: "date",
      headerName: "Date",
      sortable: true,
      filter: true,
      width: 180,
      valueFormatter: (params) => dayjs(params.value).format("DD.MM.YYYY HH:mm"),
    },
    {
      field: "duration",
      headerName: "Duration",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: "activity",
      headerName: "Activity",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      field: "customer",
      headerName: "Customer",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      disableExport: true,
      renderCell: (params) => <DeleteButtonCell {...params} />,
    },
  ]);

  function DeleteButtonCell(props) {
    return (
      <Button
        size="small"
        color="error"
        onClick={() => deleteTraining(props.row)}
      >
        <DeleteIcon />
      </Button>
    );
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const deleteTraining = (row) => {
    if (window.confirm("Are you sure?")) {
      const url = row.links.find((link) => link.rel === "self").href;
      fetch(url, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            setTrainings((prevTrainings) =>
              prevTrainings.filter((t) => t.links[0].href !== url)
            );
            setSnackbarMessage("Training deleted successfully");
            setSnackbarOpen(true);
          } else {
            alert("Something went wrong in deletion");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    const getTrainings = async () => {
      try {
        const response = await fetch(API_URL + "/trainings");
        if (!response.ok) {
          throw new Error("Error occurred in fetching trainings data");
        }
        const { content: data } = await response.json();
  
        const fetchCustomer = async (training) => {
          const customerUrl = training.links.find(
            (link) => link.rel === "customer"
          )?.href;
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

    getTrainings();
}, []);

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
      <div style={{ height: 600, width: "65%", margin: "auto"      }}>
        <DataGrid
          components={{ Toolbar: CustomToolbar }}
          rows={trainings}
          columns={columnDefs}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pagination
          pageSize={10}
          pageSizeOptions={[5, 10, 15]}
          getRowId={(row) => row.links.find((link) => link.rel === "self").href}
        />
      </div>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      />
    </>
  );
}

export default TrainingList;


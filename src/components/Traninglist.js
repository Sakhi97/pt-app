import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function Traininglist() {
  const [trainings, setTrainings] = useState([]);

  const [columnDefs] = useState([
    {
      headerName: "Date",
      field: "date",
      sortable: true,
      filter: true,
      valueFormatter: (params) => dayjs(params.value).format("DD.MM.YYYY HH:mm"),
    },
    { headerName: "Duration", field: "duration", sortable: true, filter: true },
    { headerName: "Activity", field: "activity", sortable: true, filter: true },
    { headerName: "Customer", field: "customer", sortable: true, filter: true },
  ]);

  const getTrainings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/trainings`);
      if (response.ok) {
        const data = await response.json();
        const trainingsWithCustomer = await Promise.all(
          data.content.map(async (training) => {
            const customerUrl = training.links.find((link) => link.rel === "customer").href;

            const customerResponse = await fetch(customerUrl);
            if (customerResponse.ok) {
              const customerData = await customerResponse.json();
              const customerName = `${customerData.firstname} ${customerData.lastname}`;
              return { ...training, customer: customerName };
            } else {
              throw new Error("Failed to fetch customer data");
            }
          })
        );
        setTrainings(trainingsWithCustomer);
      } else {
        throw new Error("Failed to fetch trainings data");
      }
    } catch (error) {
      console.error("Error fetching trainings:", error);
    }
  };

  useEffect(() => {
    getTrainings();
  }, []);

  return (
    <>
      <div className="ag-theme-material" style={{ width: "80%", height: 600, margin: "auto" }}>
        <AgGridReact rowData={trainings} columnDefs={columnDefs} pagination={true} paginationPageSize={10} />
      </div>
    </>
  );
}

export default Traininglist;




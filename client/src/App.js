import socketIOClient from "socket.io-client";
import React, { useState, useEffect } from "react";

const socket = socketIOClient();

function App() {

  const [tables, setTables] = useState([]);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    socket.on('initTables', tables => {
      setTables(tables);
    });

    socket.on('removeAllTables', tableName => {
      console.log('Received removeAllTables');
      setTables([]);
    });

    socket.on('addTable', tableName => {
      console.log('Received addTable');
      setTables(tables => [...tables, tableName]);
    });

    socket.on('addPoints', pointsToAdd => {
      console.log('Received addTable');
      setPoints(points => [...points, pointsToAdd]);
    });

    return () => {
      socket.off('initTables');
      socket.off('removeAllTables');
      socket.off('addTable');
      socket.off('addPoints');
    };
  }, []);

  const addTable = () => {
    const nameInput = document.getElementById("tableNameInput");
    if (nameInput.value !== "") {
      console.log("Send addTable");
      socket.emit("addTable", nameInput.value);
      nameInput.value = "";
    }
  }

  const removeAllTables = () => {
    console.log("Send removeAllTables");
    socket.emit("removeAllTables");
  }

  const addPoint = (points) => {
    console.log("Send points");
    socket.emit("addPoints", points);
  }

  return (
    <div className="App">
      <input
        type="text"
        className="blue-input"
        id="tableNameInput"
        name="name"
        placeholder="Entrer le nom d'une table .."
        required
      />
      <button
        className="blue-btn"
        onClick={() => addTable()}>
        Ajouter une table
      </button>
      <h5
        onClick={() => removeAllTables()}>
        Vider les tables
      </h5>
      <p>
        Les tables :
        {tables.map((table, index) =>
          <li key={index}>
            {table}
          </li>
        )}
      </p>
      {/* <h1
        onClick={() => addPoint(10)}>
          Ajouter des points
      </h1> */}
    </div>
  );
}

export default App;

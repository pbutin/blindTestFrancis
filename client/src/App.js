import socketIOClient from "socket.io-client";
import React, { useState, useEffect } from "react";

import Bouton from './Bouton';

const socket = socketIOClient("localhost:3001");

function App() {

  const [tables, setTables] = useState([]);
  const [points, setPoints] = useState([]);
  const [multiplicator, setMultiplicator] = useState(1);

  useEffect(() => {
    socket.on('initTables', tables => {
      setTables(tables);
    });

    socket.on('removeAllTables', tableName => {
      console.log('Received removeAllTables');
      setTables([]);
    });

    socket.on('addTable', table => {
      console.log('Received addTable:' + table);
      setTables(tables => [...tables, JSON.parse(table)]);
    });

    socket.on('addPoints', tables => {
      console.log('Received addPoints:' + JSON.stringify(tables));
      setTables(tables);
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
    if (nameInput.value.trim() !== "") {
      console.log("Send addTable");
      socket.emit("addTable", nameInput.value);
      nameInput.value = "";
    }
  }

  const removeAllTables = () => {
    console.log("Send removeAllTables");
    socket.emit("removeAllTables");
  }

  const addPoints = (table, points) => {
    console.log("Send addPoints");
    const json = {
      name: table.name,
      pointsToAdd: points
    }
    socket.emit("addPoints", json);
  }

  const insertChatPoints = (table) => {
		if (!table) {
			return null
		}

		return '  ➔ ' + table.score + ' pts';
	}

  return (
    <div className="App">
      <input
        type="text"
        className="blue-input"
        id="tableNameInput"
        name="table"
        placeholder="Entrer le nom d'une table .."
        required
      />
      <button
        className="blue-btn"
        onClick={() => addTable()}>
        Ajouter une table
      </button>
      <button
        className="red-btn"
        onClick={() => removeAllTables()}>
        Vider les tables
      </button>
      <p>
        Les tables :
      </p>
      <div className="chats">
			    {tables.map((table, index, array) => (
			    	<div key={index} >
				    	<p style={(index%2 === 0) ? {backgroundColor: "#E8E8E8"} : {}} className="table">
				    		<span className="gauche">
				    			<Bouton
				    				onClick={() => addPoints(table, -1 * multiplicator)}
				    				label={-1 * multiplicator}
				    				type="addScoreBouton"/>
				    		</span>
				    		<span className="droite">
					    		<Bouton 
					    			onClick={() => addPoints(table, 1 * multiplicator)}
					    			label={"+" + 1 * multiplicator}
					    			type="addScoreBouton"/>
						    	<Bouton
						    		onClick={() => addPoints(table, 2 * multiplicator)}
						    		label={"+" + 2 * multiplicator}
						    		type="addScoreBouton"/>
						    	<Bouton
						    		onClick={() => addPoints(table, 5 * multiplicator	)}
						    		label={"+" + 5 * multiplicator}
						    		type="addScoreBouton"/>
						    </span>
		      				<span className="table">
			      				<b className="username">
			      					{table.name}
			      				</b>
			      				{insertChatPoints(table)}
			      			</span>
		      			</p>
		      		</div>
		    	))}
    </div>
  </div>
  );
}

export default App;

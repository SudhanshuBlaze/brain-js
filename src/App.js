import "./App.css";
import { useEffect, useState } from "react";
import Papa from "papaparse";
function App() {
  // State to store parsed data
  const [net, setNet] = useState(null);
  useEffect(() => {
    if (!net) {
      const net = new window.brain.recurrent.LSTM();
      setNet(net);
      console.log(net);
    }
  }, []);

  const [parsedData, setParsedData] = useState([]);
  const [csvToJson, setCsvToJson] = useState({});

  const [tableRows, setTableRows] = useState([]);

  const [values, setValues] = useState([]);

  const [trainText, setTrainText] = useState();
  const [predictText, setPredictText] = useState();

  const changeHandler = event => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        // Iterating data to get column name and their values
        results.data.map(d => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        // Parsed Data Response in array format
        setParsedData(results.data);

        // Filtered Column Names
        setTableRows(rowsArray[0]);
        // console.log(tableRows);

        // Filtered Values
        setValues(valuesArray);
        // console.table(valuesArray);
        let result = [];
        for (let i = 1; i < valuesArray.length; i++) {
          let obj = {};
          let currentline = valuesArray[i];

          for (let j = 0; j < rowsArray[0].length; j++) {
            obj[rowsArray[0][j]] = currentline[j];
          }

          result.push(obj);
        }
        setCsvToJson(result);
        console.log(result);
      },
    });
  };

  const train = trainData => {
    try {
      net.train([trainText], { iterations: 1000 });

      alert("Training done");
    } catch (error) {
      console.error(error);
    }
  };

  const predict = predictData => {
    const output = net.run([predictText]);
    console.log(output);
    alert(output);
  };

  return (
    <div>
      {/* File Uploader */}
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      />
      <br />
      <br />
      <div>
        <input onChange={e => setTrainText(e.target.value)} type="text" />
        <button onClick={train}>Train</button>

        <input onChange={e => setPredictText(e.target.value)} type="text" />
        <button onClick={predict}>Predict</button>
      </div>
    </div>
  );
}

export default App;

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

  const [ann, setAnn] = useState(null);
  useEffect(() => {
    if (!ann) {
      const ann = new window.brain.NeuralNetwork();
      setAnn(ann);
      console.log(ann);
    }
  }, []);

  const [parsedData, setParsedData] = useState([]);
  const [csvToJson, setCsvToJson] = useState({});

  const [tableRows, setTableRows] = useState([]);

  const [values, setValues] = useState([]);

  const [trainText, setTrainText] = useState();
  const [predictText, setPredictText] = useState();

  const [target, setTargetText] = useState();
  const [feature, setFeatureText] = useState();


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

  const train = () => {
    try {
      net.train([trainText], { iterations: 1000 });

      alert("Training done");
    } catch (error) {
      console.error(error);
    }
  };

  const predict = () => {
    const output = net.run([predictText]);
    console.log(output);
    alert(output);
  };
  const change = () => {
   
    let featurecols= feature.split(",")
    // console.log(featurecols)
    let trainData=[];
    for (let i = 0; i < csvToJson.length; i++) {
      let output = {};
      let x = csvToJson[i]
      output[target]=x[target];
      let input ={}
      for(let j=0;j<featurecols.length;j++){
        input[featurecols[j]]=x[featurecols[j]];
      }
      let items={}
      items['input']=input
      items['output']=output
      trainData.push(items)
    }
    trainAnn(trainData)
    // console.log(trainData)
    // console.log(csvToJson)


  };
  const trainAnn = (trainData) => {
    try {
      ann.train(trainData, { iterations: 1000,log:stats=>console.log(stats),logPeriod:1 });
      alert("Training done");
    } catch (error) {
      console.error(error);
    }
  };
  const predictAnn = () => {
    let predictList= predictText.split(",")
    let items={}
    for(let i=0;i<predictList.length;i++){
       items[tableRows[i]]=predictList[0]
    }
    console.log(items);
    const output = ann.run(items);
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
        {/* <input onChange={e => setTrainText(e.target.value)} type="text" />
        <button onClick={train}>Train</button>

        <input onChange={e => setPredictText(e.target.value)} type="text" />
        <button onClick={predict}>Predict</button> */}
        
        <input onChange={e => setFeatureText(e.target.value)} type="text" />

        <input onChange={e => setTargetText(e.target.value)} type="text" />
        <button onClick={change}>Train</button>
        <br/>
        <input onChange={e => setPredictText(e.target.value)} type="text" />
        <button onClick={predictAnn}>Predict</button> 
        
        
      </div>
    </div>
  );
}

export default App;

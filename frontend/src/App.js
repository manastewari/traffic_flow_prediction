import React, { useState } from "react";
import Form from "./Form";
import Result from "./Result";
import "./App.css";

function App() {
  const [prediction, setPrediction] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚦 Traffic Flow Predictor</h1>
        <p>Advanced AI-powered traffic density prediction system</p>
      </header>
      <main className="App-main">
        <Form setPrediction={setPrediction} />
        <Result prediction={prediction} />
      </main>
    </div>
  );
}

export default App;

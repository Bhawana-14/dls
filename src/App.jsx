import { useState } from "react";

import MatchTypeSelector from "./components/MatchTypeSelector";
import CalculatorForm from "./components/CalculatorForm";
import ResultsDisplay from "./components/ResultsDisplay";
import TablesView from "./components/TablesView";
import MatchReport from "./components/MatchReport";
import ParScoreModal from "./components/ParScoreModal";

import "./App.css";

function App() {
  const [matchType, setMatchType] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [results, setResults] = useState(null);
  const [showTables, setShowTables] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleMatchTypeSelect = (type) => {
    setMatchType(type);
    setMatchData(null);
    setResults(null);
  };

  const handleCalculate = (data) => {
    setMatchData(data);
    // Calculation will be done in CalculatorForm component
  };

  const handleResults = (calcResults) => {
    setResults(calcResults);
  };

  const handleReset = () => {
    setMatchType(null);
    setMatchData(null);
    setResults(null);
    setShowTables(false);
    setShowReport(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ICC Duckworth-Lewis-Stern Calculator</h1>
        <h2>DLS Edition 2025 (Version 6.0)</h2>
      </header>

      <main className="App-main">
        {!matchType ? (
          <MatchTypeSelector onSelect={handleMatchTypeSelect} />
        ) : (
          <>
            <div className="controls">
              <button onClick={handleReset} className="btn-reset">
                New Match
              </button>
              <button
                onClick={() => setShowTables(!showTables)}
                className="btn-secondary"
              >
                {showTables ? "Hide" : "Show"} Tables
              </button>
              <button
                onClick={() => setShowReport(!showReport)}
                className="btn-secondary"
              >
                {showReport ? "Hide" : "Show"} Report
              </button>
            </div>

            <CalculatorForm
              matchType={matchType}
              onCalculate={handleCalculate}
              onResults={handleResults}
            />

            {results && (
              <ResultsDisplay results={results} matchData={matchData} />
            )}
            {/* {showTables && matchType && <TablesView matchType={matchType} />} */}

            {showReport && results && matchData && (
              <MatchReport results={results} matchData={matchData} />
            )}

            {results && (
              <ParScoreModal results={results} matchType={matchType} />
            )}
          </>
        )}
      </main>

      <footer className="App-footer">
        <p>&copy; {new Date().getFullYear()} International Cricket Council</p>
      </footer>
    </div>
  );
}

export default App;

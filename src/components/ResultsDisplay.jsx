import React from "react";
import "./ResultsDisplay.css";

const ResultsDisplay = ({ results, matchData }) => {
  console.log("results :", results);
  if (!results) return null;
  // let status;
  // if (runs > par_score) status = "Team 2 ahead";
  // else if (runs < par) status = "Team 2 behind";
  // else status = "Scores level";

  return (
    <div className="results-display">
      <div className="results-card">
        <h2 className="results-title">DLS Calculation Results</h2>

        <div className="results-grid">
          <div className="result-item target">
            <div className="result-label">TARGET</div>
            <div className="result-value">{results.target}</div>
            <div className="result-subtitle">(to win)</div>
          </div>

          <div className="result-item par-score">
            <div className="result-label">Par Score</div>
            <div className="result-value">{results.par_score}</div>
          </div>

          <div className="result-item resource">
            <div className="result-label">Resource Percentage</div>
            <div className="result-value">
              {results.resource_percentage || "N/A"}%{/* ?.toFixed(2)  */}
            </div>
          </div>
        </div>

        {matchData && (
          <div className="match-summary">
            <h3>Match Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">First Innings:</span>
                <span className="summary-value">
                  {matchData.first_innings_score} runs
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Overs Bowled:</span>
                <span className="summary-value">{matchData.overs_bowled}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Wickets Down:</span>
                <span className="summary-value">{matchData.wickets_down}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Overs Lost:</span>
                <span className="summary-value">{matchData.overs_lost}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;

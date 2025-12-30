import { useState, useEffect } from "react";
import apiClient from "../api/client";
import "./TablesView.css";

const ParScoreModal = ({ matchType, results }) => {
  const [loading, setLoading] = useState(false);
  const [parType, setParType] = useState("over");
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (!results) return;
    loadParTable(parType);
  }, [parType, results]);

  const loadParTable = async (type) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/api/dls/par-score-table", {
        // t2_overs_total: matchType?.maxOvers || 50,
        t2_overs_total: results.over || 50,
        lambda: results.lambda,
        adj_factor: results.adjustment_factor,
        target: results.target,
        ball_by_ball: type === "ball",
      });

      if (response.data.success) {
        setTableData(response.data.data.table);
      }
    } catch (err) {
      console.error("Failed to load par table", err);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (!tableData.length) return <div>No data available</div>;

    return (
      <div className="table-container">
        <table className="dls-table">
          <thead>
            <tr>
              <th>Overs Bowled</th>
              <th>Overs Remaining</th>
              {[...Array(10)].map((_, i) => (
                <th key={i}>{i} W</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={idx}>
                <td className="overs-cell">{row.oversBowled}</td>
                <td className="overs-rem">{row.oversRemaining}</td>
                {row.scores.map((score, i) => (
                  <td key={i}>{score}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="tables-view">
      <div className="tables-header">
        <h2>DLS Par Score Table</h2>

        <div className="tabs">
          <button
            className={`tab ${parType === "over" ? "active" : ""}`}
            onClick={() => setParType("over")}
          >
            Over-by-Over
          </button>

          <button
            className={`tab ${parType === "ball" ? "active" : ""}`}
            onClick={() => setParType("ball")}
          >
            Ball-by-Ball
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading table...</div>
      ) : (
        renderTable()
      )}
    </div>
  );
};

export default ParScoreModal;

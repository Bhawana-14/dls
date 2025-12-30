import React, { useState, useEffect } from "react";
import apiClient from "../api/client";
import "./TablesView.css";

const TablesView = ({ matchType }) => {
  const [overByOverTable, setOverByOverTable] = useState(null);
  const [ballByBallTable, setBallByBallTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("over-by-over");

  useEffect(() => {
    if (matchType) {
      loadTables();
    }
  }, [matchType]);

  const loadTables = async () => {
    setLoading(true);
    const maxOvers = matchType.maxOvers || 50;

    try {
      const [overResponse, ballResponse] = await Promise.all([
        apiClient.post("/api/dls/over-by-over-table", { max_overs: maxOvers }),
        apiClient.post("/api/dls/ball-by-ball-table", { max_overs: maxOvers }),
      ]);

      if (overResponse.data.success) {
        setOverByOverTable(overResponse.data.data);
      }
      if (ballResponse.data.success) {
        setBallByBallTable(ballResponse.data.data);
      }
    } catch (error) {
      console.error("Error loading tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (data, isBallByBall = false) => {
    if (!data || data.length === 0) return <div>No data available</div>;

    const headers = [
      "Overs",
      ...Array.from({ length: 10 }, (_, i) => `${i} W`),
    ];

    return (
      <div className="table-container">
        <table className="dls-table">
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="overs-cell">
                  {isBallByBall ? row.overs : row.overs}
                </td>
                {Array.from({ length: 10 }, (_, i) => (
                  <td key={i}>{row[`wickets_${i}`] ?? "-"}</td>
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
        <h2>DLS Tables</h2>
        <div className="tabs">
          <button
            className={`tab ${activeTab === "over-by-over" ? "active" : ""}`}
            onClick={() => setActiveTab("over-by-over")}
          >
            Over-by-Over
          </button>
          <button
            className={`tab ${activeTab === "ball-by-ball" ? "active" : ""}`}
            onClick={() => setActiveTab("ball-by-ball")}
          >
            Ball-by-Ball
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading tables...</div>
      ) : (
        <div className="table-content">
          {activeTab === "over-by-over" && renderTable(overByOverTable, false)}
          {activeTab === "ball-by-ball" && renderTable(ballByBallTable, true)}
        </div>
      )}
    </div>
  );
};

export default TablesView;

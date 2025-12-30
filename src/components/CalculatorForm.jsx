import React, { useState } from "react";
import apiClient from "../api/client";
import "./CalculatorForm.css";

const CalculatorForm = ({ matchType, onCalculate, onResults }) => {
  const [formData, setFormData] = useState({
    max_overs: matchType.maxOvers || 50,
    min_overs: matchType.minOvers || 10,
    first_innings_score: "250",
    overs_bowled: "5.0",
    wickets_down: "1",
    overs_lost: "0",
    team1_name: "",
    team2_name: "",
    runs_scored: "100",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ============================
   * FORM HANDLING
   * ============================ */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ============================
   * OVERS NORMALIZATION
   * ============================ */

  // const normalizeOvers = (overs) => {
  //   // const o = Math.floor(overs);
  //   // const balls = Math.round((overs - o) * 10);

  //   // if (balls < 0 || balls > 5) {
  //   //   throw new Error("Invalid overs format. Use .0 to .5");
  //   // }

  //   // return o + balls / 6;
  //   return overs;
  // };
  //   const normalizeOvers = (overs) => {
  //   // If overs is greater than 6 but less than 7.7, round it to 7
  //   if (overs <= 7.6) {
  //     return 7;
  //   }

  //   // Otherwise, return the overs value as is
  //   return overs;
  // };
  const normalizeOvers = (overs) => {
    // Round up to the nearest whole number if overs exceed a whole number but less than the next
    var wholeNumber = Math.floor(overs);
    const decimalPart = overs - wholeNumber;

    // If the decimal part is more than 0.5, round to the next whole number
    if (decimalPart >= 0.6) {
      throw new Error("Invalid 'overs balls' entry");
    }

    // If overs is between a whole number and the next whole number (like 6.0 to 6.5), leave it as is
    return wholeNumber + decimalPart;
  };

  /* ============================
   * SUBMIT HANDLER
   * ============================ */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const maxOvers = parseFloat(formData.max_overs);
      const oversLost = normalizeOvers(parseFloat(formData.overs_lost));
      const oversBowled = normalizeOvers(parseFloat(formData.overs_bowled));
      const wicketsDown = parseInt(formData.wickets_down, 10);

      // ---- Cricket sanity checks ----
      if (oversBowled > maxOvers) {
        throw new Error("Overs bowled cannot exceed maximum overs");
      }

      if (oversLost < 0) {
        throw new Error("Overs lost cannot be negative");
      }

      if (wicketsDown < 0 || wicketsDown > 9) {
        throw new Error("Wickets must be between 0 and 9");
      }

      /* ============================
       * PAYLOAD (MATCHES LARAVEL)
       * ============================ */

      const payload = {
        team1: {
          overs: maxOvers,
          runs: parseInt(formData.first_innings_score, 10),
          stoppages: [],
        },

        team2: {
          overs_start: maxOvers,
          stoppages: [
            {
              oversBowled,
              oversLost: oversLost || 0,
              wicketsLost: wicketsDown,
            },
          ],
        },
        penalty_runs: 0,
      };

      const response = await apiClient.post(
        "/api/dls/calculate-target",
        payload
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Calculation failed");
      }

      onResults(response.data.data);
      onCalculate(formData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during calculation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calculator-form-container">
      <form onSubmit={handleSubmit} className="calculator-form">
        {/* Match Info */}
        <div className="form-section">
          <h3>Match Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Team 1 Name</label>
              <input
                type="text"
                name="team1_name"
                value={formData.team1_name}
                onChange={handleChange}
                placeholder="e.g., India"
              />
            </div>
            <div className="form-group">
              <label>Team 2 Name</label>
              <input
                type="text"
                name="team2_name"
                value={formData.team2_name}
                onChange={handleChange}
                placeholder="e.g., Australia"
              />
            </div>
          </div>
        </div>

        {/* First Innings */}
        <div className="form-section">
          <h3>First Innings</h3>
          <div className="form-row">
            <div className="form-group">
              <label>First Innings Score</label>
              <input
                type="number"
                name="first_innings_score"
                value={formData.first_innings_score}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Max Overs</label>
              <input
                type="number"
                name="max_overs"
                value={formData.max_overs}
                onChange={handleChange}
                required
                min="1"
                max="50"
              />
            </div>
          </div>
        </div>

        {/* Second Innings */}
        <div className="form-section">
          <h3>Second Innings (Current Status)</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Overs Bowled</label>
              <input
                type="number"
                name="overs_bowled"
                value={formData.overs_bowled}
                onChange={handleChange}
                required
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label>Runs Scored</label>
              <input
                type="number"
                name="runs_scored"
                value={formData.runs_scored}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Wickets Down</label>
              <input
                type="number"
                name="wickets_down"
                value={formData.wickets_down}
                onChange={handleChange}
                required
                min="0"
                max="9"
              />
            </div>

            <div className="form-group">
              <label>Overs Lost</label>
              <input
                type="number"
                name="overs_lost"
                value={formData.overs_lost}
                onChange={handleChange}
                required
                step="0.1"
                min="0"
              />
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn-calculate" disabled={loading}>
          {loading ? "Calculating..." : "Calculate Target"}
        </button>
      </form>
    </div>
  );
};

export default CalculatorForm;

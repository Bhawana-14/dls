import React, { useState } from 'react'
import apiClient from '../api/client'
import './MatchReport.css'

const MatchReport = ({ results, matchData }) => {
  const [scorerDetails, setScorerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    comments: ''
  })
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleScorerChange = (e) => {
    const { name, value } = e.target
    setScorerDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleGenerateReport = async () => {
    setLoading(true)
    try {
      const payload = {
        match_type: matchData.match_type || 'ODI',
        team1_name: matchData.team1_name || 'Team 1',
        team2_name: matchData.team2_name || 'Team 2',
        first_innings_score: matchData.first_innings_score,
        max_overs: matchData.max_overs,
        overs_bowled: matchData.overs_bowled,
        wickets_down: matchData.wickets_down,
        overs_lost: matchData.overs_lost,
        scorer_name: scorerDetails.name,
        scorer_email: scorerDetails.email,
        scorer_phone: scorerDetails.phone,
        comments: scorerDetails.comments,
      }

      const response = await apiClient.post('/api/dls/generate-report', payload)
      
      if (response.data.success) {
        setReport(response.data.data)
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    if (!report) return

    const reportText = `
DLS Match Report
================

Match Type: ${report.match_type}
Team 1: ${report.team1_name}
Team 2: ${report.team2_name}

First Innings Score: ${report.first_innings_score}
Target: ${report.target}
Par Score: ${report.par_score}
Resource Percentage: ${report.resource_percentage}%

Scorer's Details:
Name: ${report.scorer_details.name}
Email: ${report.scorer_details.email}
Phone: ${report.scorer_details.phone}

${report.scorer_details.comments ? `Comments:\n${report.scorer_details.comments}` : ''}

Generated at: ${report.generated_at}
© ${new Date().getFullYear()} International Cricket Council
    `.trim()

    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `DLS_Report_${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="match-report">
      <div className="report-header">
        <h2>Match Report</h2>
        <div className="report-actions">
          <button onClick={handleGenerateReport} className="btn-generate" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          {report && (
            <>
              <button onClick={handlePrint} className="btn-print">Print</button>
              <button onClick={handleDownload} className="btn-download">Download</button>
            </>
          )}
        </div>
      </div>

      {!report ? (
        <div className="scorer-form">
          <h3>Scorer's Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={scorerDetails.name}
                onChange={handleScorerChange}
                placeholder="Scorer's name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={scorerDetails.email}
                onChange={handleScorerChange}
                placeholder="scorer@example.com"
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={scorerDetails.phone}
                onChange={handleScorerChange}
                placeholder="+1234567890"
              />
            </div>
            <div className="form-group full-width">
              <label>Additional Comments</label>
              <textarea
                name="comments"
                value={scorerDetails.comments}
                onChange={handleScorerChange}
                rows="4"
                placeholder="Any additional comments..."
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="report-content">
          <div className="report-section">
            <h3>{report.match_type} Match Report</h3>
            <div className="report-info">
              <div className="info-row">
                <span className="info-label">Team 1:</span>
                <span className="info-value">{report.team1_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Team 2:</span>
                <span className="info-value">{report.team2_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">First Innings Score:</span>
                <span className="info-value">{report.first_innings_score} runs</span>
              </div>
              <div className="info-row highlight">
                <span className="info-label">Target:</span>
                <span className="info-value">{report.target} runs (to win)</span>
              </div>
              <div className="info-row">
                <span className="info-label">Par Score:</span>
                <span className="info-value">{report.par_score}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Resource Percentage:</span>
                <span className="info-value">{report.resource_percentage}%</span>
              </div>
            </div>
          </div>

          {report.scorer_details.name && (
            <div className="report-section">
              <h3>Scorer's Details</h3>
              <div className="report-info">
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{report.scorer_details.name}</span>
                </div>
                {report.scorer_details.email && (
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{report.scorer_details.email}</span>
                  </div>
                )}
                {report.scorer_details.phone && (
                  <div className="info-row">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">{report.scorer_details.phone}</span>
                  </div>
                )}
                {report.scorer_details.comments && (
                  <div className="info-row">
                    <span className="info-label">Comments:</span>
                    <span className="info-value">{report.scorer_details.comments}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="report-footer">
            <p>Generated at: {new Date(report.generated_at).toLocaleString()}</p>
            <p>&copy; {new Date().getFullYear()} International Cricket Council</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchReport


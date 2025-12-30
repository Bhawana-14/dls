import React from 'react'
import './MatchTypeSelector.css'

const MatchTypeSelector = ({ onSelect }) => {
  const matchTypes = [
    {
      id: 'odi',
      name: 'ODI',
      description: '50 overs/innings (min. 20 overs/side)',
      maxOvers: 50,
      minOvers: 20
    },
    {
      id: 't20',
      name: 'T20',
      description: '20 overs/innings (min. 5 overs/side)',
      maxOvers: 20,
      minOvers: 5
    },
    {
      id: 'custom',
      name: 'Custom',
      description: 'User-chosen overs/innings and min. overs/side values',
      maxOvers: null,
      minOvers: null
    }
  ]

  return (
    <div className="match-type-selector">
      <h2 className="selector-title">Select Match Type</h2>
      <div className="match-types-grid">
        {matchTypes.map((type) => (
          <button
            key={type.id}
            className="match-type-card"
            onClick={() => onSelect(type)}
          >
            <div className="match-type-name">{type.name}</div>
            <div className="match-type-description">{type.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MatchTypeSelector



import React from 'react'
import './LoadingSkeleton.css'

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  if (type === 'table') {
    return (
      <div className="skeleton-table">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
            <div className="skeleton-cell"></div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'stats') {
    return (
      <div className="skeleton-stats">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton-stat-card">
            <div className="skeleton-stat-value"></div>
            <div className="skeleton-stat-label"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="skeleton-cards">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-card-header"></div>
          <div className="skeleton-card-body">
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
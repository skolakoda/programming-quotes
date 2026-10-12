import React from 'react'

import './PieChart.css'

const size = 200
const radius = size / 2 - 2

function point(angle) {
  return `${size / 2 + radius * Math.cos(angle)} ${size / 2 + radius * Math.sin(angle)}`
}

function slicePath(start, end) {
  const largeArc = end - start > Math.PI ? 1 : 0
  return `M ${size / 2} ${size / 2} L ${point(start)} A ${radius} ${radius} 0 ${largeArc} 1 ${point(end)} Z`
}

const percent = (value, total) => `${(value / total * 100).toFixed(1)}%`

export default function PieChart({slices, label}) {
  const total = slices.reduce((sum, {value}) => sum + value, 0)
  if (!total) return null
  let start = -Math.PI / 2

  return (
    <figure className="pie-chart">
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
        {slices.map(({label, value, color}) => {
          const end = start + value / total * 2 * Math.PI
          const title = <title>{`${label}: ${value} (${percent(value, total)})`}</title>
          const slice = value === total
            ? <circle key={label} cx={size / 2} cy={size / 2} r={radius} fill={color}>{title}</circle>
            : <path key={label} d={slicePath(start, end)} fill={color}>{title}</path>
          start = end
          return slice
        })}
      </svg>
      <figcaption>
        <ul>
          {slices.map(({label, value, color}) =>
            <li key={label}>
              <span className="swatch" style={{background: color}} />
              {label}
              <span className="value">{value} ({percent(value, total)})</span>
            </li>
          )}
        </ul>
      </figcaption>
    </figure>
  )
}

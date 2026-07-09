export default function EvolutionChart({ matches }) {
  if (matches.length < 2) {
    return (
      <div className="empty-state">
        Cargá al menos 2 partidas para ver la evolución.
      </div>
    )
  }

  const chronological = [...matches].reverse()

  const width = 800
  const height = 220
  const padding = 36
  const maxKda = Math.max(...chronological.map((m) => m.kda), 1)
  const stepX = (width - padding * 2) / (chronological.length - 1)

  function xAt(i) {
    return padding + i * stepX
  }
  function yAt(kda) {
    return height - padding - (kda / maxKda) * (height - padding * 2)
  }

  const linePoints = chronological.map((m, i) => `${xAt(i)},${yAt(m.kda)}`).join(' ')

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {[0, 0.5, 1].map((f) => (
          <line
            key={f}
            x1={padding}
            x2={width - padding}
            y1={padding + f * (height - padding * 2)}
            y2={padding + f * (height - padding * 2)}
            className="chart-grid"
          />
        ))}

        <polyline points={linePoints} className="chart-line" fill="none" />

        {chronological.map((m, i) => (
          <circle
            key={m.id}
            cx={xAt(i)}
            cy={yAt(m.kda)}
            r="5"
            className={m.result === 0 ? 'chart-dot win' : 'chart-dot loss'}
          >
            <title>{m.champion} — KDA {m.kda.toFixed(1)}</title>
          </circle>
        ))}
      </svg>
      <div className="chart-legend">
        <span><i className="dot win" /> Victoria</span>
        <span><i className="dot loss" /> Derrota</span>
        <span className="chart-legend-label">KDA por partida, en orden cronológico</span>
      </div>
    </div>
  )
}
export default function WinrateGauge({ percent = 0 }) {
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  const ticks = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * 360
    const rad = (angle * Math.PI) / 180
    const cx = 60 + radius * Math.cos(rad)
    const cy = 60 + radius * Math.sin(rad)
    return { x: cx, y: cy, angle }
  })

  return (
    <div className="gauge-wrap">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle className="gauge-track" cx="60" cy="60" r={radius} />
        <circle
          className="gauge-fill"
          cx="60"
          cy="60"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        {ticks.map((t, i) => (
          <circle key={i} className="gauge-tick" cx={t.x} cy={t.y} r="1.5" />
        ))}
      </svg>
      <div className="gauge-center">
        <span className="pct">{Math.round(percent)}%</span>
        <span className="pct-label">Winrate</span>
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'

const CONFETTI_COLORS = ['#D4A24C', '#4FA8D8', '#5FBFB3', '#E6EDF3']

export default function ResultFX({ trigger }) {
  const [pieces, setPieces] = useState([])
  const [showLoss, setShowLoss] = useState(false)

  useEffect(() => {
    if (trigger === 'win') {
      const generated = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 1.6 + Math.random() * 0.8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotate: Math.random() * 360,
      }))
      setPieces(generated)
      const t = setTimeout(() => setPieces([]), 2600)
      return () => clearTimeout(t)
    }

    if (trigger === 'loss') {
      setShowLoss(true)
      const t = setTimeout(() => setShowLoss(false), 1800)
      return () => clearTimeout(t)
    }
  }, [trigger])

  return (
    <div className="fx-layer" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}

      {showLoss && (
        <div className="loss-banner">
          <span>La próxima sale</span>
        </div>
      )}
    </div>
  )
}
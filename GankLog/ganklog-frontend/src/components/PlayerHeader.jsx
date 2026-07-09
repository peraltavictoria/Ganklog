import WinrateGauge from './WinrateGauge'

export default function PlayerHeader({ player, stats }) {
  if (!player || !stats) return null

  return (
    <div className="player-card">
      <div className="player-info">
        <p className="username">{player.username}</p>
        <p className="meta">{player.rank} · {player.region}</p>

        <div className="stat-row">
          <div className="stat-block">
            <div className="label">Partidas</div>
            <div className="value">{stats.totalMatches}</div>
          </div>
          <div className="stat-block">
            <div className="label">KDA prom.</div>
            <div className="value">{stats.averageKDA}</div>
          </div>
          <div className="stat-block">
            <div className="label">Más jugado</div>
            <div className="value champ">{stats.mostPlayedChampion ?? '—'}</div>
          </div>
          <div className="stat-block">
            <div className="label">Mejor WR</div>
            <div className="value champ">{stats.bestWinRateChampion ?? '—'}</div>
          </div>
        </div>
      </div>

      <WinrateGauge percent={stats.winRatePercent} />
    </div>
  )
}
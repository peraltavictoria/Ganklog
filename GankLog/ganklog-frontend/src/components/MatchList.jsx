import { useState, useMemo } from 'react'
import { ROLES } from '../api'

export default function MatchList({ matches, onDelete, onEdit }) {
  const [roleFilter, setRoleFilter] = useState('all')
  const [championFilter, setChampionFilter] = useState('')

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      const roleOk = roleFilter === 'all' || m.role === Number(roleFilter)
      const champOk = championFilter.trim() === '' ||
        m.champion.toLowerCase().includes(championFilter.trim().toLowerCase())
      return roleOk && champOk
    })
  }, [matches, roleFilter, championFilter])

  return (
    <div>
      <div className="filters-bar">
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">Todos los roles</option>
          {ROLES.map((r, i) => (
            <option key={r} value={i}>{r}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Buscar campeón…"
          value={championFilter}
          onChange={(e) => setChampionFilter(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          {matches.length === 0
            ? 'Todavía no cargaste ninguna partida.'
            : 'Ninguna partida coincide con el filtro.'}
        </div>
      ) : (
        <div className="match-list">
          {filtered.map((m) => (
            <div key={m.id} className={`match-card ${m.result === 1 ? 'loss' : ''}`}>
              <span className="match-role">{ROLES[m.role]}</span>
              <span className="match-champion">{m.champion}</span>
              <span className="match-kda">
                <b>{m.kills}</b>/<b>{m.deaths}</b>/<b>{m.assists}</b>
              </span>
              <span className="match-kda-ratio">{m.kda.toFixed(1)}</span>
              <span className="match-duration">{m.durationMinutes}m</span>
              <button className="match-edit" onClick={() => onEdit(m)} title="Editar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
              <button className="match-delete" onClick={() => onDelete(m.id)} title="Eliminar">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
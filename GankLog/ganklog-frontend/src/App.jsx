import { useEffect, useState, useCallback } from 'react'
import { api, getSession, clearSession } from './api'
import Auth from './components/Auth'
import PlayerHeader from './components/PlayerHeader'
import MatchForm from './components/MatchForm'
import MatchList from './components/MatchList'
import EvolutionChart from './components/EvolutionChart'
import ResultFX from './components/ResultFX'

export default function App() {
  const [session, setSession] = useState(() => getSession())
  const [player, setPlayer] = useState(null)
  const [stats, setStats] = useState(null)
  const [matches, setMatches] = useState([])
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [editingMatch, setEditingMatch] = useState(null)
  const [fxTrigger, setFxTrigger] = useState(null)

  const loadAll = useCallback(async (playerId) => {
    try {
      setError(null)
      const [p, s, m] = await Promise.all([
        api.getPlayer(playerId),
        api.getPlayerStats(playerId),
        api.getMatches(playerId),
      ])
      setPlayer(p)
      setStats(s)
      setMatches(m)
    } catch (err) {
      setError('No se pudo conectar con la API. Verificá que el backend esté corriendo en localhost:5136.')
    }
  }, [])

  useEffect(() => {
    if (session) loadAll(session.playerId)
  }, [session, loadAll])

  function handleAuthenticated(result) {
    setSession({ token: result.token, playerId: result.playerId, username: result.username })
  }

  function handleLogout() {
    clearSession()
    setSession(null)
    setPlayer(null)
    setStats(null)
    setMatches([])
  }

  async function handleSubmitMatch(data) {
    setSubmitting(true)
    try {
      if (editingMatch) {
        await api.updateMatch(session.playerId, editingMatch.id, data)
        setEditingMatch(null)
      } else {
        await api.createMatch(session.playerId, data)
        setFxTrigger(data.result === 0 ? 'win' : 'loss')
        setTimeout(() => setFxTrigger(null), 100)
      }
      await loadAll(session.playerId)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteMatch(matchId) {
    if (editingMatch?.id === matchId) setEditingMatch(null)
    await api.deleteMatch(session.playerId, matchId)
    await loadAll(session.playerId)
  }

  function handleEditMatch(match) {
    setEditingMatch(match)
  }

  function handleCancelEdit() {
    setEditingMatch(null)
  }

  if (!session) {
    return <Auth onAuthenticated={handleAuthenticated} />
  }

  return (
    <div className="app">
      <ResultFX trigger={fxTrigger} />

      <div className="auth-user-bar">
        <div className="header" style={{ marginBottom: 0 }}>
          <span className="rivet" />
          <h1>Gank<span>Log</span></h1>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
      </div>

      {error && <div className="status-banner error">{error}</div>}

      <PlayerHeader player={player} stats={stats} />

      <p className="section-title">Evolución</p>
      <EvolutionChart matches={matches} />

      <p className="section-title">{editingMatch ? 'Editar partida' : 'Nueva partida'}</p>
      <MatchForm
        onSubmit={handleSubmitMatch}
        submitting={submitting}
        editingMatch={editingMatch}
        onCancelEdit={handleCancelEdit}
      />

      <p className="section-title">Historial ({matches.length})</p>
      <MatchList matches={matches} onDelete={handleDeleteMatch} onEdit={handleEditMatch} />
    </div>
  )
}
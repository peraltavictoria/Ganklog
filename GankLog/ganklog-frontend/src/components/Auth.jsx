import { useState } from 'react'
import { api, saveSession, RANKS, REGIONS } from '../api'

const EMPTY = {
  username: '',
  email: '',
  password: '',
  rank: RANKS[0],
  region: 'LAS',
}

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : form

      const result = mode === 'login'
        ? await api.login(payload)
        : await api.register(payload)

      saveSession(result)
      onAuthenticated(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="header" style={{ justifyContent: 'center', marginBottom: 24 }}>
          <span className="rivet" />
          <h1>Gank<span>Log</span></h1>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => { setMode('login'); setError(null) }}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => { setMode('register'); setError(null) }}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="field">
              <label>Nombre de invocador</label>
              <input
                value={form.username}
                onChange={(e) => update('username', e.target.value)}
                maxLength={30}
                required
              />
            </div>
          )}

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              minLength={6}
              required
            />
          </div>

          {mode === 'register' && (
            <>
              <div className="field">
                <label>Rango</label>
                <select value={form.rank} onChange={(e) => update('rank', e.target.value)}>
                  {RANKS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Región</label>
                <select value={form.region} onChange={(e) => update('region', e.target.value)}>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Cargando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
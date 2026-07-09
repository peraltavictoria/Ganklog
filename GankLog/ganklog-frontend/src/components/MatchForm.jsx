import { useState, useEffect } from 'react'
import { ROLES, RESULTS } from '../api'

const EMPTY = {
  champion: '',
  role: 2,
  result: 0,
  kills: 0,
  deaths: 0,
  assists: 0,
  durationMinutes: 25,
}

export default function MatchForm({ onSubmit, submitting, editingMatch, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (editingMatch) {
      setForm({
        champion: editingMatch.champion,
        role: editingMatch.role,
        result: editingMatch.result,
        kills: editingMatch.kills,
        deaths: editingMatch.deaths,
        assists: editingMatch.assists,
        durationMinutes: editingMatch.durationMinutes,
      })
    } else {
      setForm(EMPTY)
    }
  }, [editingMatch])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.champion.trim()) {
      setError('Falta el nombre del campeón.')
      return
    }
    setError(null)
    try {
      await onSubmit({
        ...form,
        role: Number(form.role),
        result: Number(form.result),
        kills: Number(form.kills),
        deaths: Number(form.deaths),
        assists: Number(form.assists),
        durationMinutes: Number(form.durationMinutes),
      })
      setForm(EMPTY)
    } catch (err) {
      setError(err.message)
    }
  }

  const isEditing = Boolean(editingMatch)

  return (
    <form className="match-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Campeón</label>
        <input
          value={form.champion}
          onChange={(e) => update('champion', e.target.value)}
          placeholder="Ahri"
          maxLength={30}
        />
      </div>

      <div className="field">
        <label>Rol</label>
        <select value={form.role} onChange={(e) => update('role', e.target.value)}>
          {ROLES.map((r, i) => (
            <option key={r} value={i}>{r}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Resultado</label>
        <select value={form.result} onChange={(e) => update('result', e.target.value)}>
          {RESULTS.map((r, i) => (
            <option key={r} value={i}>{r === 'Win' ? 'Victoria' : 'Derrota'}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Kills</label>
        <input type="number" min="0" max="50" value={form.kills}
          onChange={(e) => update('kills', e.target.value)} />
      </div>

      <div className="field">
        <label>Deaths</label>
        <input type="number" min="0" max="50" value={form.deaths}
          onChange={(e) => update('deaths', e.target.value)} />
      </div>

      <div className="field">
        <label>Assists</label>
        <input type="number" min="0" max="50" value={form.assists}
          onChange={(e) => update('assists', e.target.value)} />
      </div>

      <div className="field">
        <label>Duración (min)</label>
        <input type="number" min="1" max="120" value={form.durationMinutes}
          onChange={(e) => update('durationMinutes', e.target.value)} />
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="form-actions">
        {isEditing && (
          <button type="button" className="btn btn-ghost" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Cargar partida'}
        </button>
      </div>
    </form>
  )
}
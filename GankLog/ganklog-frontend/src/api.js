const BASE_URL = 'http://localhost:5136/api'

function getToken() {
  return localStorage.getItem('ganklog_token')
}

export function getSession() {
  const token = localStorage.getItem('ganklog_token')
  const playerId = localStorage.getItem('ganklog_playerId')
  const username = localStorage.getItem('ganklog_username')
  if (!token || !playerId) return null
  return { token, playerId: Number(playerId), username }
}

export function saveSession({ token, playerId, username }) {
  localStorage.setItem('ganklog_token', token)
  localStorage.setItem('ganklog_playerId', String(playerId))
  localStorage.setItem('ganklog_username', username)
}

export function clearSession() {
  localStorage.removeItem('ganklog_token')
  localStorage.removeItem('ganklog_playerId')
  localStorage.removeItem('ganklog_username')
}

async function request(path, options = {}) {
  const token = getToken()

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })

  if (res.status === 401) {
    clearSession()
    window.location.reload()
    throw new Error('Sesión expirada, volvé a iniciar sesión.')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const message = body?.title || body?.errors
      ? JSON.stringify(body.errors || body.title)
      : `Error ${res.status}`
    throw new Error(message)
  }

  if (res.status === 204) return null
  return res.json()
}

export const api = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getPlayer: (id) => request(`/players/${id}`),
  getPlayerStats: (id) => request(`/players/${id}/stats`),
  getMatches: (playerId) => request(`/players/${playerId}/matches`),
  createMatch: (playerId, data) =>
    request(`/players/${playerId}/matches`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMatch: (playerId, matchId, data) =>
    request(`/players/${playerId}/matches/${matchId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteMatch: (playerId, matchId) =>
    request(`/players/${playerId}/matches/${matchId}`, { method: 'DELETE' }),
}
export const ROLES = ['Top', 'Jungle', 'Mid', 'ADC', 'Support']
export const RESULTS = ['Win', 'Loss']

export const RANKS = [
  'Sin rango',
  'Hierro',
  'Bronce',
  'Plata',
  'Oro',
  'Platino',
  'Esmeralda',
  'Diamante',
  'Maestro',
  'Gran Maestro',
  'Retador',
]

export const REGIONS = ['LAN', 'LAS', 'NA', 'EUW', 'EUNE', 'KR', 'BR', 'OCE', 'TR', 'RU', 'JP']
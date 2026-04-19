import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchAlerts = async () => {
  const response = await api.get('/alerts')
  return response.data
}

export default api

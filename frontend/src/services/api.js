import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    // 格式化 FastAPI validation error 为可读字符串
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail
      if (Array.isArray(detail)) {
        error.response.data.detail = detail
          .map((e) => `${e.loc.join(' -> ')}: ${e.msg}`)
          .join('; ')
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (email, password) => api.post('/api/v1/auth/login', { username: email, password }),
  register: (username, email, password) => api.post('/api/v1/auth/register', { username, email, password }),
  getCurrentUser: () => api.get('/api/v1/auth/me'),
}

export const constitutionAPI = {
  getQuestions: () => api.get('/api/v1/constitution/questions'),
  assess: (answers) => api.post('/api/v1/constitution/assess', { answers }),
  getHistory: () => api.get('/api/v1/constitution/history'),
  getCurrent: () => api.get('/api/v1/constitution/current'),
}

export const solarTermAPI = {
  getCurrent: () => api.get('/api/v1/solar-term/current'),
  getAll: () => api.get('/api/v1/solar-term/all'),
  getById: (id) => api.get(`/api/v1/solar-term/${id}`),
}

export const fiveElementAPI = {
  getAnalysis: () => api.get('/api/v1/five-element/analysis'),
  getFoods: (element) => api.get(`/api/v1/five-element/foods?element=${element || ''}`),
}

export const recipeAPI = {
  getAll: () => api.get('/api/v1/recipes'),
  getById: (id) => api.get(`/api/v1/recipes/${id}`),
  search: (keyword) => api.get(`/api/v1/recipes/search/${keyword}`),
  recommend: (params) => api.get('/api/v1/recipes/recommend', { params }),
}

export const healthAPI = {
  createRecord: (record) => api.post('/api/v1/health/record', record),
  getRecords: () => api.get('/api/v1/health/records'),
  recordDiet: (recipeId, mealType, quantity) => api.post('/api/v1/health/diet', { recipeId, mealType, quantity }),
  getStatistics: () => api.get('/api/v1/health/statistics'),
}

export const qaAPI = {
  ask: (question) => api.post('/api/v1/qa/ask', { question }),
}

export default api
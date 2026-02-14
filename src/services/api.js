import axios from 'axios'

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
const API_URL = `${STRAPI_URL}/api`
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN

// Create axios instance for Strapi
const strapiApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
strapiApi.interceptors.request.use(
    async (config) => {
        // Add Strapi API token if available
        if (STRAPI_TOKEN) {
            config.headers.Authorization = `Bearer ${STRAPI_TOKEN}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for error handling
strapiApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('Strapi API Error:', error.response.data)
        } else if (error.request) {
            console.error('Network Error:', error.message)
        }
        return Promise.reject(error)
    }
)

export default strapiApi

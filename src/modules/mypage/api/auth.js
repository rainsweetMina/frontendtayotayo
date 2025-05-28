// src/api/auth.js
import axios from 'axios'

export const login = async (userId, password) => {
    return await axios.post('/api/login', { userId, password })
}

import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser]       = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) { setLoading(false); return }
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        axios.get('http://localhost:8000/me')
            .then(r => setUser(r.data))
            .catch(() => localStorage.removeItem('token'))
            .finally(() => setLoading(false))
    }, [])

    const login = async (username: string, password: string) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const r = await axios.post('http://localhost:8000/login', params)
        const { token, user } = r.data
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(user)
        return user
    }

    const register = async (username: string, email: string, password: string) => {
        const r = await axios.post('http://localhost:8000/register', { username, email, password })
        const { token, user } = r.data
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(user)
        return user
    }

    const logout = () => {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        setUser(null)
    }

    const refreshUser = async () => {
        const r = await axios.get('http://localhost:8000/me')
        setUser(r.data)
    }

    return (
        <AuthCtx.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthCtx.Provider>
    )
}

export const useAuth = () => useContext(AuthCtx)
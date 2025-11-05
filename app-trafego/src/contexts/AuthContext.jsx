import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const login = async (username, password) => {
    // Aqui você pode implementar a chamada real para sua API
    // Por enquanto, vamos simular um login básico
    if (username === 'admin' && password === 'admin123') {
      const userData = {
        id: 1,
        username,
        name: 'Administrador',
        role: 'admin'
      }
      setUser(userData)
      return { success: true }
    }
    return { success: false, error: 'Credenciais inválidas' }
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
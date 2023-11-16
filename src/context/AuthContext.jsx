import React, { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [userId, setUserId] = useState(localStorage.getItem('user_id'))
    
    const login = (newToken, newUserId) => {
        setToken(newToken)
        setUserId(newUserId)
    }

    const verifyToken = () => {
        console.log('verify')
    }
    
    return (
        <AuthContext.Provider value={{ token, userId, login, verifyToken }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
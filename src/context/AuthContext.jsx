import React, { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [userId, setUserId] = useState(localStorage.getItem('user_id'))
    
    const login = (newToken, newUserId) => {
        setToken(newToken)
        setUserId(newUserId)
    }

    return (
        <AuthContext.Provider value={{ token, userId, login }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute() {
    const { token, verifyToken } = useAuth()

    verifyToken()

    return (
        !token ? <Navigate to="/" /> : <Outlet />
    )
}

export default ProtectedRoute
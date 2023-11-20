function verifyToken({ status }) {
    if (status === 403) {
        localStorage.removeItem("token")
        localStorage.removeItem('user_id')

        return false
    }
    else {
        return true
    }
}

export default verifyToken
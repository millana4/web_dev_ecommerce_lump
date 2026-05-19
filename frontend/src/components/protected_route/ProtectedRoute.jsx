import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAdmin } from '../../store/slices/authSlice'

function ProtectedRoute({ children }) {
  const isAdmin = useSelector(selectIsAdmin)
  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute
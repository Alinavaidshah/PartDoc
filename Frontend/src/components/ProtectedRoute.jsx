import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useSelector((state) => state.auth);

  // 1. Agar data load ho raha hai, toh kuch mat karo (ya loader dikhao)
  if (loading) {
    return <div>Loading...</div>; 
  }

  // 2. Agar load ho gaya aur admin nahi hai, tabhi redirect karo
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  // 3. Sab sahi hai, toh Dashboard dikhao
  return children;
};

export default ProtectedRoute;
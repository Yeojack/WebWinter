import { useLocation } from "react-router";
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>로딩 중 . . .</div>;
    }

    if (!user) {
        return <Navigate to='/login' replace state={{ from: location }} />;
    }

    return children;
}
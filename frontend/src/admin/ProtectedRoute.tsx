import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('bn_admin_token');
  if (!token) {
    return <Navigate to="/admin/loginx  " replace />;
  }
  return <>{children}</>;
}

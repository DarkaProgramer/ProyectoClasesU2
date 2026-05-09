import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { JSX } from 'react';

// Definimos la estructura exacta para evitar el error 'never'
interface UserRole {
  name: string;
}

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Cargando sesión... "Vamo a calmarno"</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    // Usamos 'as any' o una validación de tipo más segura para extraer el string del rol
    const roleData = user.role;
    let userRoleName: string;

    if (typeof roleData === 'object' && roleData !== null && 'name' in roleData) {
      // Si es un objeto tipo { name: 'Admin' }
      userRoleName = (roleData as UserRole).name;
    } else {
      // Si ya es un string 'Admin'
      userRoleName = String(roleData);
    }

    if (!allowedRoles.includes(userRoleName)) {
      console.warn(`Acceso denegado. Rol actual: ${userRoleName}`);
      return <Navigate to="/home" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
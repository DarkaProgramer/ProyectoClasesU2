import { useState, useEffect, type ReactNode, useCallback } from 'react';
import { AuthContext, type User } from './AuthContext';
import API from '../services/api';
import { jwtDecode } from 'jwt-decode';

// Definimos la estructura del token para evitar el uso de 'any'
interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  exp: number;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Declaramos logout primero para que initializeAuth pueda usarlo sin errores de orden
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // 2. Efecto para restaurar la sesión al cargar la página
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token && token !== "undefined") {
          const decoded = jwtDecode<JwtPayload>(token);
          
          // Verificamos si el token no ha expirado
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            logout();
          } else {
            // Sincronizamos el rol con los nombres de tu tabla en Laragon
            setUser({
              id: decoded.sub,
              email: decoded.email,
              role: decoded.role as "ADMIN" | "USER",
            });
          }
        }
      } catch (error) {
        console.error("Error al restaurar la sesión", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [logout]);

  // 3. Función para iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { access_token } = res.data as { access_token: string };

      if (access_token) {
        const decoded = jwtDecode<JwtPayload>(access_token);
        
        // Creamos el objeto de usuario con el tipado estricto
        const userData: User = {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role as "ADMIN" | "USER",
        };

        localStorage.setItem('token', access_token);
        setUser(userData);
        
        return { success: true };
      }
      
      return { 
        success: false, 
        message: 'Algo salió mal. "¡Esos bastardos me mintieron!"' 
      };
    } catch (err: unknown) {
      // Atrapamos el error y extraemos el mensaje (incluyendo tus mensajes de memes)
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';

function App() {
  return (
    /* El Provider envuelve al Router para que todo el sistema de navegación tenga acceso al usuario */
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* 1. Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 2. Rutas Protegidas para TODOS (User y Admin) */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <Home />
              </ProtectedRoute>
            } 
          />

          {/* NUEVA RUTA: Perfil de usuario */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* 3. RUTA EXCLUSIVA PARA ADMINS */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* 4. Manejo de rutas inexistentes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
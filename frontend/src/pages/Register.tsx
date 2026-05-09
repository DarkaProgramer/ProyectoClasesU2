import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import Swal from 'sweetalert2';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      Swal.fire('¡Éxito!', 'Usuario creado. "Vamo a calmarno", ahora loguéate.', 'success');
      navigate('/login');
    } catch (err: unknown) {
      // 1. Manejamos el error de forma segura en lugar de usar 'any'
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al registrarse';
      
      Swal.fire('¡Error!', errorMessage, 'error');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Crear Cuenta</h1>
        <input 
          type="text" 
          placeholder="Nombre completo" 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required 
        />
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña segura" 
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required 
        />
        <button type="submit">Registrarse</button>

        <p style={{ marginTop: '1rem' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#007bff', fontWeight: 'bold' }}>Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
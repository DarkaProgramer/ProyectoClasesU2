import React, { useState } from 'react';
import { authService } from '../api/auth.service';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const data = await authService.login(email, password);
      // Pasamos el token y los datos del usuario al contexto global
      login(data.access_token, data.user); 
      navigate('/'); 
    } catch (err: unknown) {
      // Tipado seguro para capturar el mensaje de error de NestJS
      let errorMessage = 'Error al iniciar sesión';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: { message: unknown } } };
        const data = axiosError.response?.data;
        
        // NestJS suele mandar el error en la propiedad 'message'
        errorMessage = Array.isArray(data?.message) 
          ? data.message[0] 
          : data?.message || errorMessage;
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '80px auto', 
      padding: '30px', 
      border: '1px solid #ddd', 
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Iniciar Sesión</h2>
      <p style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
        Proyecto Seguridad - UTNG
      </p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Correo Electrónico:
          </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="ejemplo@correo.com"
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '6px', 
              border: '1px solid #ccc',
              boxSizing: 'border-box' 
            }}
            required 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Contraseña:
          </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="******"
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '6px', 
              border: '1px solid #ccc',
              boxSizing: 'border-box'
            }}
            required 
          />
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#fff5f5', 
            color: '#c53030', 
            padding: '10px', 
            borderRadius: '6px', 
            marginBottom: '15px',
            fontSize: '14px',
            border: '1px solid #feb2b2'
          }}>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          Acceder al Sistema
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
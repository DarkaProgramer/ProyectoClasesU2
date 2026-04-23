import React, { useState } from 'react';
import { authService } from '../api/auth.service';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await authService.register(name, email, password);
      setSuccess(true);
      // Redirigir al login después de 2 segundos para que vea el mensaje de éxito
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      let errorMessage = 'Error al registrarse';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: { message: unknown } } };
        errorMessage = Array.isArray(axiosError.response?.data?.message) 
          ? axiosError.response.data.message[0] 
          : axiosError.response?.data?.message || errorMessage;
      }
      setError(errorMessage);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Crear Cuenta</h2>
      
      {success ? (
        <div style={{ backgroundColor: '#f0fff4', color: '#2f855a', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
          ¡Registro exitoso! Redirigiendo al login...
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Nombre completo:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Correo Electrónico:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Contraseña:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              required 
            />
          </div>

          {error && <div style={{ color: '#c53030', marginBottom: '15px' }}>{error}</div>}

          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Registrarse
          </button>
          
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default RegisterPage;
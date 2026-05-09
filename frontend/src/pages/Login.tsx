import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Ejecutamos la función de login del AuthProvider
    const result = await login(email, password);

    // 2. SOLO si la respuesta es exitosa, disparamos la lógica de entrada
    if (result.success) {
      // Usamos .then() para esperar a que la alerta termine o el timer expire
      Swal.fire({
        icon: 'success',
        title: '¡Acceso Concedido!',
        text: 'Vamo a calmarno, entrando al sistema...',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        // 3. ESTO SE EJECUTA CUANDO EL ALERT SE CIERRA AUTOMÁTICAMENTE
        console.log("Navegando a home...");
        // replace: true evita que el usuario regrese al login dándole al botón de "atrás"
        navigate('/home', { replace: true });
      });

    } else {
      // 4. Si falla, mostramos el mensaje de error (los memes del back)
      Swal.fire({
        icon: 'error',
        title: '¡Paren todo!',
        text: result.message || 'Credenciales incorrectas',
        confirmButtonText: 'Fíjate bien, mijo'
      });
    }
  };

  return (
    <div className="auth-container" style={styles.container}>
      <form onSubmit={(e) => { void handleSubmit(e); }} style={styles.form}>
        <h1 style={{ textAlign: 'center' }}>Login</h1>
        
        <div style={styles.inputGroup}>
          <input 
            type="email" 
            placeholder="Correo" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>Ingresar</button>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          ¿Eres nuevo? <Link to="/register" style={styles.link}>Crea una cuenta</Link>
        </p>
      </form>
    </div>
  );
};

// Estilos para la estructura
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' },
  form: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '350px' },
  inputGroup: { marginBottom: '1rem' },
  input: { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' as const },
  button: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  link: { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }
};

export default Login;
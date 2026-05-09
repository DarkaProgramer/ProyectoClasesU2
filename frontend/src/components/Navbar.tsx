import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>🚀 UTNG Tasks</div>
      
      <ul style={styles.navLinks}>
        <li>
          <Link to="/home" style={styles.link}>🏠 Inicio</Link>
        </li>

        <li>
          <Link to="/profile" style={styles.link}>👤 Perfil</Link>
        </li>

        {/* PANEL ADMIN - Solo visible si el rol es ADMIN */}
        {user?.role === 'ADMIN' && (
          <li>
            <Link to="/admin" style={styles.adminBtn}>🛡️ Admin</Link>
          </li>
        )}
      </ul>

      <div style={styles.userInfo}>
        <div style={styles.userBadge}>
          <span style={styles.userEmail}>{user?.email}</span>
          <span style={styles.roleTag}>{user?.role}</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Salir</button>
      </div>
    </nav>
  );
};

// Se agrega el tipado Record<string, React.CSSProperties> para eliminar los errores de TS
const styles: Record<string, React.CSSProperties> = {
  nav: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0.8rem 2rem', 
    backgroundColor: '#1a252f', 
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  brand: { fontSize: '1.4rem', fontWeight: 'bold', color: '#3498db' },
  navLinks: { 
    display: 'flex', 
    listStyle: 'none', 
    gap: '25px', 
    margin: 0, 
    padding: 0 
  },
  link: { 
    color: '#bdc3c7', 
    textDecoration: 'none', 
    fontWeight: '500',
    transition: 'color 0.3s'
  },
  adminBtn: { 
    backgroundColor: '#e74c3c', 
    color: 'white', 
    padding: '4px 12px', 
    borderRadius: '20px', 
    textDecoration: 'none', 
    fontSize: '0.9rem',
    fontWeight: 'bold',
    border: '1px solid white' 
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
  userBadge: { 
    display: 'flex', 
    flexDirection: 'column', // TS ahora valida este string correctamente
    alignItems: 'flex-end',
    borderRight: '1px solid #34495e',
    paddingRight: '15px'
  },
  userEmail: { fontSize: '0.85rem', color: '#ecf0f1' },
  roleTag: { 
    fontSize: '0.7rem', 
    background: '#34495e', 
    padding: '2px 6px', 
    borderRadius: '4px',
    marginTop: '2px',
    color: '#3498db',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  logoutBtn: { 
    backgroundColor: 'transparent', 
    border: '1px solid #95a5a6', 
    color: '#95a5a6', 
    padding: '5px 12px', 
    cursor: 'pointer', 
    borderRadius: '4px',
    transition: 'all 0.3s'
  }
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api';
import Swal from 'sweetalert2';

interface AxiosErrorResponse {
  response?: { data?: { message?: string } };
}

const Profile = () => {
  const { user } = useAuth();
  
  // Interfaz basada en tu esquema de Prisma
  const currentUser = user as { 
    id: number; 
    email: string; 
    role: string; 
    name?: string | null;
  };
  
  // Estado para el input y estado para la visualización arriba
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [currentDisplayName, setCurrentDisplayName] = useState(currentUser?.name || '');
  const [loading, setLoading] = useState(false);

  // Sincronizar si el objeto user cambia
  useEffect(() => {
    if (currentUser?.name) {
      setNameInput(currentUser.name);
      setCurrentDisplayName(currentUser.name);
    }
  }, [currentUser]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Actualizamos en la DB
      await API.patch(`/users/${currentUser?.id}`, { name: nameInput });
      
      // ¡ESTO ES LO IMPORTANTE!: Actualizamos la vista local inmediatamente
      setCurrentDisplayName(nameInput);

      await Swal.fire({
        icon: 'success',
        title: '¡Nombre actualizado!',
        text: `Ahora te verán como: ${nameInput}`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: unknown) {
      const err = error as AxiosErrorResponse;
      Swal.fire('Error', err.response?.data?.message || 'No se pudo actualizar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* SECCIÓN 1: Visualización de Datos (Reflejando cambios reales) */}
        <div style={styles.viewSection}>
          <h2 style={styles.title}>👤 Información del Usuario</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>ID Único</span>
              <span style={styles.infoValue}>#{currentUser?.id}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Nombre Actual</span>
              {/* Aquí usamos el estado local que sí cambia al darle clic al botón */}
              <span style={{...styles.infoValue, color: currentDisplayName ? '#2c3e50' : '#e74c3c'}}>
                {currentDisplayName || 'Sin nombre asignado'}
              </span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Correo Electrónico</span>
              <span style={styles.infoValue}>{currentUser?.email}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Rol de Sistema</span>
              <span style={{...styles.infoValue, color: '#3498db', fontWeight: 'bold'}}>
                {currentUser?.role}
              </span>
            </div>
          </div>
        </div>

        <hr style={styles.divider} />

        {/* SECCIÓN 2: Formulario de Edición */}
        <div style={styles.editSection}>
          <h3 style={styles.subTitle}>📝 Editar Perfil</h3>
          <form onSubmit={handleUpdate} style={styles.form}>
            <div style={styles.group}>
              <label style={styles.label}>Nuevo Nombre:</label>
              <input 
                type="text" 
                value={nameInput} 
                onChange={(e) => setNameInput(e.target.value)} 
                placeholder="Ej: Claudio Ángel"
                style={styles.input}
              />
              <p style={styles.hint}>Este nombre se guardará en tu registro de usuario.</p>
            </div>

            <button type="submit" disabled={loading} style={styles.saveBtn}>
              {loading ? 'Guardando...' : 'Actualizar Nombre'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ... (los mismos estilos que ya tenías)
const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', justifyContent: 'center', padding: '3rem 1rem', backgroundColor: '#f8f9fa', minHeight: '90vh' },
  card: { background: 'white', padding: '2.5rem', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', width: '100%', maxWidth: '550px' },
  title: { fontSize: '1.5rem', color: '#2c3e50', marginBottom: '1.5rem', textAlign: 'center' },
  subTitle: { fontSize: '1.2rem', color: '#34495e', marginBottom: '1rem' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '10px' },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  infoLabel: { fontSize: '0.75rem', color: '#95a5a6', textTransform: 'uppercase', letterSpacing: '0.5px' },
  infoValue: { fontSize: '1rem', color: '#2c3e50', fontWeight: 500 },
  divider: { border: 'none', borderTop: '1px solid #eee', margin: '2rem 0' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  group: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontWeight: 'bold', fontSize: '0.9rem', color: '#2c3e50' },
  input: { padding: '12px', borderRadius: '8px', border: '2px solid #e0e0e0', fontSize: '1rem', outline: 'none' },
  hint: { fontSize: '0.8rem', color: '#7f8c8d', margin: 0 },
  saveBtn: { padding: '14px', background: '#1abc9c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }
};

export default Profile;
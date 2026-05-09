import React, { useEffect, useState, useCallback } from 'react';
import API from '../services/api';
import Swal from 'sweetalert2';

// Interfaces alineadas a tu esquema de Prisma y DTOs
interface User {
  id: number;
  email: string;
  name: string | null;
  role: { name: string };
}

interface AuditLog {
  id: number;
  event: string;
  severity: string;
  details: string;
  createdAt: string;
  userId?: number;
  targetUserId?: number | null;
  user?: { email: string };
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const AdminDashboard = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'logs' | 'users'>('logs');
  const [filterSeverity, setFilterSeverity] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = filterSeverity ? { severity: filterSeverity } : {};
      
      const [logsRes, usersRes] = await Promise.allSettled([
        API.get('/audit', { params }),
        API.get('/users')
      ]);

      if (logsRes.status === 'fulfilled') setLogs(logsRes.value.data);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data);

    } catch (err: unknown) {
      console.error("Error al sincronizar datos:", err);
    } finally {
      setLoading(false);
    }
  }, [filterSeverity]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      if (isMounted) await fetchData();
    };
    loadData().catch(console.error);
    return () => { isMounted = false; };
  }, [fetchData]);

  // Registro Manual con Selector de Usuario (Formulario completo)
  const handleManualLog = async () => {
    // Asegurar que los usuarios estén cargados
    if (users.length === 0) {
      await Swal.fire({
        icon: 'info',
        title: 'Cargando usuarios...',
        text: 'Espera un momento mientras se cargan los datos',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    const userOptions = users
      .map(u => `<option value="${u.id}">${u.name || u.email} (ID: ${u.id})</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: '📝 Crear Auditoría',
      html: `
        <div style="text-align: left; display: flex; flex-direction: column; gap: 10px;">
          <label style="font-weight: bold; margin-top: 10px;">👥 Usuario a Auditar:</label>
          <select id="swal-target" class="swal2-select" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="">-- Acción General (Sin usuario específico) --</option>
            ${userOptions}
          </select>

          <label style="font-weight: bold; margin-top: 10px;">⚠️ Severidad:</label>
          <select id="swal-severity" class="swal2-select" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ddd;">
            <option value="Baja">🟢 Baja</option>
            <option value="Media">🟡 Media</option>
            <option value="Alta">🟠 Alta</option>
            <option value="Crítica">🔴 Crítica</option>
          </select>

          <label style="font-weight: bold; margin-top: 10px;">📌 Evento:</label>
          <input id="swal-event" class="swal2-input" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ddd;" placeholder="Ej: Revisión de seguridad, Cambio de rol...">

          <label style="font-weight: bold; margin-top: 10px;">📝 Detalles:</label>
          <textarea id="swal-details" class="swal2-textarea" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #ddd; min-height: 80px;" placeholder="Notas detalladas del administrador..."></textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '✅ Guardar Auditoría',
      cancelButtonText: '❌ Cancelar',
      confirmButtonColor: '#27ae60',
      cancelButtonColor: '#e74c3c',
      preConfirm: () => {
        const event = (document.getElementById('swal-event') as HTMLInputElement)?.value;
        const severity = (document.getElementById('swal-severity') as HTMLSelectElement)?.value;
        const details = (document.getElementById('swal-details') as HTMLTextAreaElement)?.value;
        const targetUserId = (document.getElementById('swal-target') as HTMLSelectElement)?.value;

        if (!event || !details) {
          Swal.showValidationMessage('❌ ¡Fíjate bien! Faltan datos obligatorios (Evento y Detalles).');
          return false;
        }
        
        if (event.length < 3) {
          Swal.showValidationMessage('❌ El evento debe tener al menos 3 caracteres.');
          return false;
        }

        if (details.length < 5) {
          Swal.showValidationMessage('❌ Los detalles deben tener al menos 5 caracteres.');
          return false;
        }

        return { 
          event: event.trim(), 
          severity, 
          details: details.trim(), 
          targetUserId: targetUserId ? parseInt(targetUserId) : null 
        };
      }
    });

    if (formValues) {
      try {
        await API.post('/audit', formValues);
        await Swal.fire({
          icon: 'success',
          title: '¡Auditoría Creada!',
          text: 'El registro se ha guardado correctamente',
          timer: 1500,
          showConfirmButton: false
        });
        void fetchData();
      } catch (error: unknown) {
        const err = error as AxiosErrorResponse;
        const msg = err.response?.data?.message || 'Error al conectar con la API';
        Swal.fire('Error', msg, 'error');
      }
    }
  };

  const handleEditUser = async (user: User) => {
    const { value: newName } = await Swal.fire({
      title: 'Editar Usuario',
      input: 'text',
      inputValue: user.name || '',
      showCancelButton: true,
      confirmButtonText: 'Actualizar'
    });

    if (newName !== undefined) {
      try {
        await API.patch(`/users/${user.id}`, { name: newName });
        await Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1000, showConfirmButton: false });
        void fetchData(); 
      } catch (error: unknown) {
        const err = error as AxiosErrorResponse;
        Swal.fire('Error', err.response?.data?.message || 'No se pudo actualizar.', 'error');
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>🛡️ Panel de Control Supremo</h1>
          <p style={{ color: '#666' }}>"Un gran poder conlleva una gran responsabilidad."</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleManualLog} style={styles.manualBtn}>📋 Crear Auditoría</button>
          <button onClick={() => fetchData()} style={styles.refreshBtn}>🔄 Refrescar</button>
        </div>
      </header>

      <div style={styles.toolbar}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setView('logs')} style={view === 'logs' ? styles.btnActive : styles.btnInactive}>📜 Auditoría</button>
          <button onClick={() => setView('users')} style={view === 'users' ? styles.btnActive : styles.btnInactive}>👥 Usuarios</button>
        </div>
        {view === 'logs' && (
          <select onChange={(e) => setFilterSeverity(e.target.value)} style={styles.select} value={filterSeverity}>
            <option value="">Todas las severidades</option>
            <option value="Baja">🟢 Baja</option>
            <option value="Media">🟡 Media</option>
            <option value="Alta">🟠 Alta</option>
            <option value="Crítica">🔴 Crítica</option>
          </select>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}><h3>Cargando... 🐢</h3></div>
      ) : (
        <div style={styles.card}>
          {view === 'logs' ? <TableLogs logs={logs} /> : <TableUsers users={users} onEdit={handleEditUser} />}
        </div>
      )}
    </div>
  );
};

const TableLogs = ({ logs }: { logs: AuditLog[] }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={styles.table}>
      <thead>
        <tr style={styles.headerRow}>
          <th style={styles.th}>Evento</th>
          <th style={styles.th}>Severidad</th>
          <th style={styles.th}>Detalles</th>
          <th style={styles.th}>Responsable / Objetivo</th>
          <th style={styles.th}>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {logs.map(log => (
          <tr key={log.id} style={styles.row}>
            <td style={styles.td}><b>{log.event}</b></td>
            <td style={styles.td}>
              <span style={{
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: 
                  log.severity === 'Crítica' ? '#ffebee' :
                  log.severity === 'Alta' ? '#fff3e0' :
                  log.severity === 'Media' ? '#e8f5e9' : '#f3e5f5',
                color:
                  log.severity === 'Crítica' ? '#c62828' :
                  log.severity === 'Alta' ? '#ef6c00' :
                  log.severity === 'Media' ? '#2e7d32' : '#6a1b9a'
              }}>
                {log.severity}
              </span>
            </td>
            <td style={styles.td}>{log.details}</td>
            <td style={styles.td}>
              <div>👤 {log.user?.email || 'SISTEMA'}</div>
              {log.targetUserId && (
                <div style={{ fontSize: '0.8rem', color: '#e74c3c', marginTop: '4px' }}>
                  🎯 Auditado: ID {log.targetUserId}
                </div>
              )}
            </td>
            <td style={styles.td}>{new Date(log.createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const TableUsers = ({ users, onEdit }: { users: User[], onEdit: (u: User) => void }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={styles.table}>
      <thead>
        <tr style={styles.headerRow}>
          <th style={styles.th}>ID</th>
          <th style={styles.th}>Email</th>
          <th style={styles.th}>Nombre</th>
          <th style={styles.th}>Rol Actual</th>
          <th style={styles.th}>Acción</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id} style={styles.row}>
            <td style={styles.td}>{u.id}</td>
            <td style={styles.td}><b>{u.email}</b></td>
            <td style={styles.td}>{u.name || '---'}</td>
            <td style={styles.td}>{u.role.name}</td>
            <td style={styles.td}><button onClick={() => onEdit(u)} style={styles.editBtn}>✏️ Editar</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  header: { borderBottom: '2px solid #eee', marginBottom: '20px', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  toolbar: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  headerRow: { background: '#f8f9fa', textAlign: 'left' },
  th: { padding: '12px', fontWeight: 'bold', borderBottom: '2px solid #ddd' },
  td: { padding: '12px', borderBottom: '1px solid #eee' },
  row: { transition: 'background 0.2s' },
  btnActive: { padding: '10px 20px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  btnInactive: { padding: '10px 20px', background: '#ecf0f1', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  refreshBtn: { padding: '8px 15px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  manualBtn: { padding: '8px 15px', background: '#9c27b0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  select: { padding: '8px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#fff' },
  editBtn: { background: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default AdminDashboard;
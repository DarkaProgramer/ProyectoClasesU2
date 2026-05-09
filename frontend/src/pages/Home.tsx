import { useEffect, useState, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Swal from 'sweetalert2';

interface Task {
  id: number;
  activityName: string;
  description: string;
  importance: number;
  status: string;
}

const Home = () => {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Estados del formulario
  const [activityName, setActivityName] = useState('');
  const [description, setDescription] = useState('');
  const [importance, setImportance] = useState(1);
  const [status, setStatus] = useState("No realizada");

  // Estado para saber si estamos editando
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  // 1. Envolvemos en useCallback y usamos el actualizador de estado funcional
  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(() => res.data as Task[]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar tareas';
      console.error(msg);
    }
  }, []);

  // 2. Usamos el timer de 0ms para romper el flujo síncrono del renderizado
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks().catch(console.error);
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setActivityName(task.activityName);
    setDescription(task.description);
    setImportance(task.importance);
    setStatus(task.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setActivityName('');
    setDescription('');
    setImportance(1);
    setStatus("No realizada");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await API.patch(`/tasks/${editingTaskId}`, { 
          activityName, 
          description, 
          importance, 
          status 
        });
        await Swal.fire({ icon: 'success', title: '¡Tarea actualizada!', timer: 1500, showConfirmButton: false });
      } else {
        await API.post('/tasks', { activityName, description, importance, status: "No realizada" });
        await Swal.fire({ icon: 'success', title: '¡Tarea guardada!', timer: 1500, showConfirmButton: false });
      }

      cancelEditing();
      void fetchTasks();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado';
      await Swal.fire({ icon: 'error', title: '¡Paren todo!', text: msg });
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>{editingTaskId ? '✏️ Editando Tarea' : '📋 Mis Pendientes'}</h1>
        <button onClick={logout} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>Cerrar Sesión</button>
      </header>

      <section style={{ marginBottom: '3rem', border: `2px solid ${editingTaskId ? '#007bff' : '#ccc'}`, padding: '1.5rem', borderRadius: '8px' }}>
        <form onSubmit={(e) => { void handleSubmit(e); }}>
          <input 
            type="text" placeholder="Nombre de la actividad" value={activityName}
            onChange={(e) => setActivityName(e.target.value)} required 
            style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
          />
          <textarea 
            placeholder="Descripción" value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '100%', height: '60px', padding: '8px' }}
          />
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <select value={importance} onChange={(e) => setImportance(Number(e.target.value))} style={{ flex: 1, padding: '8px' }}>
              <option value={1}>Baja</option>
              <option value={2}>Media</option>
              <option value={3}>Alta</option>
            </select>
            
            {editingTaskId && (
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ flex: 1, padding: '8px' }}>
                <option value="No realizada">No realizada</option>
                <option value="En proceso">En proceso</option>
                <option value="Realizada">Realizada</option>
              </select>
            )}
          </div>

          <button type="submit" style={{ padding: '10px', backgroundColor: editingTaskId ? '#007bff' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
            {editingTaskId ? 'Guardar Cambios' : 'Crear Tarea'}
          </button>
          
          {editingTaskId && (
            <button type="button" onClick={cancelEditing} style={{ marginTop: '10px', width: '100%', padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancelar Edición
            </button>
          )}
        </form>
      </section>

      <section>
        <h3>Tu lista:</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {tasks.map((task) => (
            <div key={task.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', backgroundColor: task.status === 'Realizada' ? '#f8f9fa' : 'white' }}>
              <button 
                onClick={() => startEditing(task)} 
                style={{ float: 'right', padding: '5px 10px', backgroundColor: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Editar
              </button>
              <h4 style={{ margin: 0, textDecoration: task.status === 'Realizada' ? 'line-through' : 'none' }}>{task.activityName}</h4>
              <p style={{ fontSize: '14px', color: '#666' }}>{task.description}</p>
              <small><strong>Estatus:</strong> {task.status}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Tach.css'; // Make sure your CSS is updated to match the design

const Tach = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/tache', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const newTask = {
      titre: taskName,
      description: taskDescription,
      terminee: false,
    };

    if (editing) {
      try {
        await axios.put(`http://localhost:8000/api/tache/taches/${editing}`, newTask, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === editing ? { ...task, ...newTask } : task))
        );
        resetForm();
      } catch (error) {
        console.error('Error updating task:', error);
        alert('Error: Could not update task');
      }
    } else {
      try {
        const response = await axios.post('http://localhost:8000/api/tache', newTask, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks((prevTasks) => [...prevTasks, response.data]);
        resetForm();
      } catch (error) {
        console.error('Error creating task:', error);
        alert('Error: Could not create task');
      }
    }
  };

  const resetForm = () => {
    setTaskName('');
    setTaskDescription('');
    setEditing(null);
    setIsModalOpen(false);
  };

  const handleEdit = (task) => {
    setTaskName(task.titre);
    setTaskDescription(task.description);
    setEditing(task.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/tache/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="task-container">
      <img src={`${process.env.PUBLIC_URL}/images.png`} alt="Logo" className="logo" />
      <h2 className="task-title">TODO List</h2>

      <button className="add-button" onClick={() => setIsModalOpen(true)}>
        + Add task
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={resetForm}>
              &times;
            </span>
            <h3>{editing ? 'Edit task' : 'Add task'}</h3>
            <form className="task-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Task title"
                required
              />
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Task description"
                required
              />
              <button className="submit-button" type="submit">
                {editing ? 'Edit' : 'Add'}
              </button>
            </form>
          </div>
        </div>
      )}

      <table className="task-table">
        <thead>
          <tr>
            <th>Completed</th>
            <th>Task Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={task.terminee ? 'task-completed' : ''}>
              <td>
                <input type="checkbox" checked={task.terminee}  />
              </td>
              <td>{task.titre}</td>
              <td className="task-actions">
                <button className="edit-button" onClick={() => handleEdit(task)}>
                  <i className="fas fa-pencil-alt"></i>
                </button>
                <button className="delete-button" onClick={() => handleDelete(task.id)}>
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tach;

import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import '../styles/Tasks.css';

const Tasks = () => {
  const [task, setTask] = useState('');
  const [tasksList, setTasksList] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksRef = firebase.firestore().collection('tasks');
      const unsubscribe = tasksRef.onSnapshot((snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasksList(tasksData);
      });
      return () => unsubscribe();
    };

    fetchTasks();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tasksRef = firebase.firestore().collection('tasks');
    tasksRef.add({ taskText: task });
    setTask('');
  };

  const handleDelete = (taskId) => {
    const tasksRef = firebase.firestore().collection('tasks');
    tasksRef.doc(taskId).delete();
  };

  return (
    <div className="tasks-container">
      <h1>Seznam úkolů</h1>
      <form onSubmit={handleSubmit} className="task-form">
        <label>
          Task:
          <input type="text" value={task} onChange={(e) => setTask(e.target.value)} className="task-input" />
        </label>
        <button type="submit" className="add-button">Přidat úkol</button>
      </form>

      <table className="task-table">
        <thead>
          <tr>
            <th>Úkol</th>
            <th>Akce</th>
          </tr>
        </thead>
        <tbody>
          {tasksList.map((taskItem) => (
            <tr key={taskItem.id} className="task-item">
              <td>{taskItem.taskText}</td>
              <td>
                <button onClick={() => handleDelete(taskItem.id)} className="delete-button">Odstranit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;
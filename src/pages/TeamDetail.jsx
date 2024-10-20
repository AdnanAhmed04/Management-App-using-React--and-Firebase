// src/pages/TeamDetail.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import styles from '../styles/TeamDetail.module.css';

function TeamDetail() {
  const { teamId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const currentUser = auth.currentUser;

  // Fetch tasks and members
  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(collection(db, 'tasks'), where('teamId', '==', teamId));
      const querySnapshot = await getDocs(q);
      setTasks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchTeamMembers = async () => {
      const teamDoc = await getDocs(query(collection(db, 'teams'), where('__name__', '==', teamId)));
      const teamData = teamDoc.docs[0]?.data() || {};
      const members = teamData.members || [];

      const usersQuery = query(collection(db, 'users'), where('__name__', 'in', members));
      const userDocs = await getDocs(usersQuery);
      const membersDetails = userDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeamMembers(membersDetails);
    };

    fetchTasks();
    fetchTeamMembers();
  }, [teamId]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'tasks'), {
        teamId,
        title: taskTitle,
        description: taskDescription,
        status: 'pending',
        creatorId: currentUser.uid,
        members: [currentUser.uid, ...selectedUsers], // Auto-add creator
        messages: [],
      });

      alert('Task added successfully!');
      setTaskTitle('');
      setTaskDescription('');
      setSelectedUsers([]);
      setShowTaskForm(false);

      const q = query(collection(db, 'tasks'), where('teamId', '==', teamId));
      const querySnapshot = await getDocs(q);
      setTasks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className={styles.container}>
      <h2>Team Tasks</h2>

      <button onClick={() => setShowTaskForm((prev) => !prev)}>
        {showTaskForm ? 'Close Task Form' : 'Add Task'}
      </button>

      {showTaskForm && (
        <form onSubmit={handleAddTask} className={styles.taskForm}>
          <input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Task Description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            required
          />
          <div className={styles.userList}>
            {teamMembers.map((member) => (
              <label key={member.id}>
                <input
                  type="checkbox"
                  onChange={() => handleUserSelection(member.id)}
                  checked={selectedUsers.includes(member.id)}
                />
                {member.email || member.name}
              </label>
            ))}
          </div>
          <button type="submit">Add Task</button>
        </form>
      )}

      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <ul className={styles.taskList}>
          {tasks.map((task) => (
            <li key={task.id}>
              <Link to={`/task-detail/${task.id}`}>
                <h3>{task.title}</h3>
                <p>Status: {task.status}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TeamDetail;

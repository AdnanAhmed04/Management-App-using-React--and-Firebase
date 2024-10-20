// src/pages/AssignTask.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDoc, doc, addDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import styles from '../styles/AssignTask.module.css';

function AssignTask() {
  const { teamId } = useParams();
  const [taskDescription, setTaskDescription] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [assignedUser, setAssignedUser] = useState('');
  const currentUser = auth.currentUser;

  // Fetch team members from Firestore
  useEffect(() => {
    const fetchTeamMembers = async () => {
      const teamDoc = await getDoc(doc(db, 'teams', teamId));
      setTeamMembers(teamDoc.data().members);
    };
    fetchTeamMembers();
  }, [teamId]);

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'tasks'), {
        teamId,
        description: taskDescription,
        assignedBy: currentUser.uid,
        assignedTo: assignedUser,
        status: 'pending',
        messages: [], // Initialize empty message list
      });

      alert('Task assigned successfully!');
      setTaskDescription('');
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Assign Task</h2>
      <form onSubmit={handleAssignTask}>
        <textarea
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
        />
        <select
          value={assignedUser}
          onChange={(e) => setAssignedUser(e.target.value)}
          required
        >
          <option value="">Select Member</option>
          {teamMembers.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
        </select>
        <button type="submit">Assign Task</button>
      </form>
    </div>
  );
}

export default AssignTask;

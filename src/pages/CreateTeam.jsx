// src/pages/CreateTeam.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CreateTeam.module.css';

function CreateTeam() {
  const [teamName, setTeamName] = useState('');
  const [teamType, setTeamType] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs
        .map(doc => ({ id: doc.id, email: doc.data().email }))
        .filter(user => user.id !== currentUser.uid); // Exclude current user
      setUsers(usersList);
    };

    fetchUsers();
  }, [currentUser]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'teams'), {
        name: teamName,
        type: teamType,
        members: [currentUser.uid, ...selectedUsers],
      });
      alert('Team created successfully!');
      navigate('/my-teams');
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create a Team</h2>
      <form onSubmit={handleCreateTeam} className={styles.form}>
        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />
        <select
          value={teamType}
          onChange={(e) => setTeamType(e.target.value)}
          required
        >
          <option value="">Select Team Type</option>
          <option value="Marketing">Marketing</option>
          <option value="Development">Development</option>
        </select>

        <h3>Select Members</h3>
        <div className={styles.userList}>
          {users.map((user) => (
            <label key={user.id}>
              <input
                type="checkbox"
                onChange={() => setSelectedUsers((prev) =>
                  prev.includes(user.id) ? prev.filter(id => id !== user.id) : [...prev, user.id]
                )}
              />
              {user.email}
            </label>
          ))}
        </div>
        <button type="submit">Create Team</button>
      </form>
    </div>
  );
}

export default CreateTeam;

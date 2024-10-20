// src/pages/MyTeams.jsx
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/MyTeams.module.css';

function MyTeams() {
  const [teams, setTeams] = useState([]);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      const q = query(collection(db, 'teams'), where('members', 'array-contains', currentUser.uid));
      const querySnapshot = await getDocs(q);
      setTeams(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchTeams();
  }, [currentUser]);

  const handleTeamClick = (teamId) => {
    navigate(`/team/${teamId}`);
  };

  return (
    <div className={styles.container}>
      <h2>My Teams</h2>
      <ul className={styles.teamList}>
        {teams.map((team) => (
          <li key={team.id} onClick={() => handleTeamClick(team.id)}>
            <h3>{team.name}</h3>
            <p>Type: {team.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyTeams;

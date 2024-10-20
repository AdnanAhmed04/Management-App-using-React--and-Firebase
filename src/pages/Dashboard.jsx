// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Dashboard.module.css';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>Welcome to the Team Management App</h1>
      <div className={styles.options}>
        <button onClick={() => navigate('/create-team')}>Create Team</button>
        <button onClick={() => navigate('/my-teams')}>View My Teams</button>
      </div>
    </div>
  );
}

export default Dashboard;

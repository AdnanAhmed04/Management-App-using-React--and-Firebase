// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/my-teams">My Teams</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;

// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyTeams from './pages/MyTeams';
import CreateTeam from './pages/CreateTeam';
import TeamDetail from './pages/TeamDetail';
import TaskDetail from './pages/TaskDetail';
import PrivateRoute from './PrivateRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-teams"
          element={
            <PrivateRoute>
              <MyTeams />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-team"
          element={
            <PrivateRoute>
              <CreateTeam />
            </PrivateRoute>
          }
        />
        <Route
          path="/team/:teamId"
          element={
            <PrivateRoute>
              <TeamDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/task-detail/:taskId"
          element={
            <PrivateRoute>
              <TaskDetail />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

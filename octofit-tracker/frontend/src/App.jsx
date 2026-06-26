import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const CODESPACE_NAME = import.meta.env.VITE_CODESPACE_NAME;
const apiBaseUrl = CODESPACE_NAME
  ? `https://${CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

/**
 * To use Codespaces-hosted API, define VITE_CODESPACE_NAME in .env.local:
 * VITE_CODESPACE_NAME=your-codespace-name
 *
 * When unset, the application falls back to localhost:8000.
 */
export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>OctoFit Tracker</h1>
        <p className="app-note">
          API base URL: <strong>{apiBaseUrl}</strong>
        </p>
      </header>

      <nav className="app-nav">
        <NavLink to="/users" end>
          Users
        </NavLink>
        <NavLink to="/teams">Teams</NavLink>
        <NavLink to="/activities">Activities</NavLink>
        <NavLink to="/workouts">Workouts</NavLink>
        <NavLink to="/leaderboard">Leaderboard</NavLink>
      </nav>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Users apiBaseUrl={apiBaseUrl} />} />
          <Route path="/users" element={<Users apiBaseUrl={apiBaseUrl} />} />
          <Route path="/teams" element={<Teams apiBaseUrl={apiBaseUrl} />} />
          <Route path="/activities" element={<Activities apiBaseUrl={apiBaseUrl} />} />
          <Route path="/workouts" element={<Workouts apiBaseUrl={apiBaseUrl} />} />
          <Route path="/leaderboard" element={<Leaderboard apiBaseUrl={apiBaseUrl} />} />
        </Routes>
      </main>
    </div>
  );
}

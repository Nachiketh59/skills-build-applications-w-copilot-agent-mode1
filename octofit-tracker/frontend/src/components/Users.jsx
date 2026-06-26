import { useEffect, useState } from 'react';

// Example Codespaces API endpoint:
// `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`
function normalizeResponse(data) {
  if (Array.isArray(data)) return data;
  if (data.users) return data.users;
  if (data.data) return data.data;
  if (data.items) return data.items;
  const arrayValue = Object.values(data).find(Array.isArray);
  return arrayValue || [];
}

export default function Users({ apiBaseUrl }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/users/`);
        const data = await response.json();
        setUsers(normalizeResponse(data));
      } catch (fetchError) {
        setError('Unable to load users.');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [apiBaseUrl]);

  return (
    <section>
      <h2 className="section-title">Users</h2>
      <p className="section-copy">Users are loaded from the backend API and rendered with team details when available.</p>

      {loading && <p className="message-box">Loading users...</p>}
      {error && <p className="message-box error-box">{error}</p>}
      {!loading && !error && users.length === 0 && <p className="message-box">No users found.</p>}

      <div className="entity-grid">
        {users.map((user) => (
          <article className="entity-card" key={user._id}>
            <strong>{user.name}</strong>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>
            <p>Points: {user.totalPoints}</p>
            {user.team ? <p>Team: {user.team.name}</p> : <p>No assigned team</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

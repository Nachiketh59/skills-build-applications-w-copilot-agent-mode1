import { useEffect, useState } from 'react';

// Example Codespaces API endpoint:
// `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
function normalizeResponse(data) {
  if (Array.isArray(data)) return data;
  if (data.leaderboard) return data.leaderboard;
  if (data.data) return data.data;
  if (data.items) return data.items;
  const arrayValue = Object.values(data).find(Array.isArray);
  return arrayValue || [];
}

export default function Leaderboard({ apiBaseUrl }) {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/leaderboard/`);
        const data = await response.json();
        setEntries(normalizeResponse(data));
      } catch (fetchError) {
        setError('Unable to load leaderboard.');
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, [apiBaseUrl]);

  return (
    <section>
      <h2 className="section-title">Leaderboard</h2>
      <p className="section-copy">Top ranked users and their current points.</p>

      {loading && <p className="message-box">Loading leaderboard...</p>}
      {error && <p className="message-box error-box">{error}</p>}
      {!loading && !error && entries.length === 0 && <p className="message-box">No leaderboard entries found.</p>}

      <div className="entity-grid">
        {entries.map((entry) => (
          <article className="entity-card" key={entry._id}>
            <strong>#{entry.rank} {entry.user?.name ?? 'Unknown'}</strong>
            <p>Points: {entry.points}</p>
            <p>Weekly change: {entry.weeklyChange}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

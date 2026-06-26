import { useEffect, useState } from 'react';

interface LeaderboardProps {
  apiBaseUrl: string;
}

interface Entry {
  _id: string;
  rank: number;
  points: number;
  weeklyChange: number;
  user?: { name: string };
}

function normalizeResponse<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data.leaderboard) return data.leaderboard;
  if (data.data) return data.data;
  if (data.items) return data.items;
  const arrayValue = Object.values(data).find(Array.isArray);
  return (arrayValue as T[]) || [];
}

export default function Leaderboard({ apiBaseUrl }: LeaderboardProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/leaderboard/`);
        const data = await response.json();
        setEntries(normalizeResponse<Entry>(data));
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

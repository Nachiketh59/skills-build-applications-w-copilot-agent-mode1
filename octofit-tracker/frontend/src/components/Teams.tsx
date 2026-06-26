import { useEffect, useState } from 'react';

interface TeamsProps {
  apiBaseUrl: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Team {
  _id: string;
  name: string;
  description: string;
  members: Member[];
}

function normalizeResponse<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data.teams) return data.teams;
  if (data.data) return data.data;
  if (data.items) return data.items;
  const arrayValue = Object.values(data).find(Array.isArray);
  return (arrayValue as T[]) || [];
}

export default function Teams({ apiBaseUrl }: TeamsProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/teams/`);
        const data = await response.json();
        setTeams(normalizeResponse<Team>(data));
      } catch (fetchError) {
        setError('Unable to load teams.');
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, [apiBaseUrl]);

  return (
    <section>
      <h2 className="section-title">Teams</h2>
      <p className="section-copy">View teams and their members from the backend API.</p>

      {loading && <p className="message-box">Loading teams...</p>}
      {error && <p className="message-box error-box">{error}</p>}
      {!loading && !error && teams.length === 0 && <p className="message-box">No teams found.</p>}

      <div className="entity-grid">
        {teams.map((team) => (
          <article className="entity-card" key={team._id}>
            <strong>{team.name}</strong>
            <p>{team.description}</p>
            <p>
              Members: {team.members.length} {team.members.length === 1 ? 'member' : 'members'}
            </p>
            <ul>
              {team.members.map((member) => (
                <li key={member._id}>{member.name} ({member.role})</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

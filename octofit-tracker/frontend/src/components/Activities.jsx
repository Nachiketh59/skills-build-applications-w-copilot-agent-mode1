import { useEffect, useState } from 'react';

// Example Codespaces API endpoint:
// `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
function normalizeResponse(data) {
  if (Array.isArray(data)) return data;
  if (data.activities) return data.activities;
  if (data.data) return data.data;
  if (data.items) return data.items;
  const arrayValue = Object.values(data).find(Array.isArray);
  return arrayValue || [];
}

export default function Activities({ apiBaseUrl }) {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/activities/`);
        const data = await response.json();
        setActivities(normalizeResponse(data));
      } catch (fetchError) {
        setError('Unable to load activities.');
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, [apiBaseUrl]);

  return (
    <section>
      <h2 className="section-title">Activities</h2>
      <p className="section-copy">Recent user activities from the OctoFit Tracker backend.</p>

      {loading && <p className="message-box">Loading activities...</p>}
      {error && <p className="message-box error-box">{error}</p>}
      {!loading && !error && activities.length === 0 && <p className="message-box">No activities found.</p>}

      <div className="entity-grid">
        {activities.map((activity) => (
          <article className="entity-card" key={activity._id}>
            <strong>{activity.type}</strong>
            <p>User: {activity.user?.name ?? 'Unknown'}</p>
            <p>Duration: {activity.durationMinutes} min</p>
            <p>Calories: {activity.caloriesBurned}</p>
            <p>Date: {new Date(activity.date).toLocaleString()}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

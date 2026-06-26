import { useEffect, useState } from 'react';

function normalizeResponse(data) {
  if (Array.isArray(data)) return data;
  if (data.workouts) return data.workouts;
  if (data.data) return data.data;
  if (data.items) return data.items;
  const arrayValue = Object.values(data).find(Array.isArray);
  return arrayValue || [];
}

export default function Workouts({ apiBaseUrl }) {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/workouts/`);
        const data = await response.json();
        setWorkouts(normalizeResponse(data));
      } catch (fetchError) {
        setError('Unable to load workouts.');
      } finally {
        setLoading(false);
      }
    }

    loadWorkouts();
  }, [apiBaseUrl]);

  return (
    <section>
      <h2 className="section-title">Workouts</h2>
      <p className="section-copy">Workout plans and exercise breakdown from the backend.</p>

      {loading && <p className="message-box">Loading workouts...</p>}
      {error && <p className="message-box error-box">{error}</p>}
      {!loading && !error && workouts.length === 0 && <p className="message-box">No workouts found.</p>}

      <div className="entity-grid">
        {workouts.map((workout) => (
          <article className="entity-card" key={workout._id}>
            <strong>{workout.name}</strong>
            <p>Category: {workout.category}</p>
            <p>Duration: {workout.durationMinutes} min</p>
            <p>Difficulty: {workout.difficulty}</p>
            <p>Exercises: {workout.exercises?.join(', ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

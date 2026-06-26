import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-shell">
      <h1>OctoFit Tracker</h1>
      <p>React 19 + Vite frontend running on port 5173.</p>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Count is {count}
      </button>
    </div>
  );
}

export default App;

import express from 'express';
import { connectDatabase } from './config/database';
import User from './models/user';
import Team from './models/team';
import Activity from './models/activity';
import Workout from './models/workout';
import LeaderboardEntry from './models/leaderboard';

const app = express();
const PORT = Number(process.env.PORT || 8000);
const CODESPACE_NAME = process.env.CODESPACE_NAME;
const apiBaseUrl = CODESPACE_NAME
  ? `https://${CODESPACE_NAME}-8000.app.github.dev`
  : `http://localhost:${PORT}`;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', apiBaseUrl });
});

app.get('/api/users/', async (_req, res) => {
  try {
    const users = await User.find().populate('team', 'name description').lean();
    res.json({ users });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'Unable to fetch users' });
  }
});

app.get('/api/teams/', async (_req, res) => {
  try {
    const teams = await Team.find().populate('members', 'name email role').lean();
    res.json({ teams });
  } catch (error) {
    console.error('Fetch teams error:', error);
    res.status(500).json({ error: 'Unable to fetch teams' });
  }
});

app.get('/api/activities/', async (_req, res) => {
  try {
    const activities = await Activity.find().populate('user', 'name email').lean();
    res.json({ activities });
  } catch (error) {
    console.error('Fetch activities error:', error);
    res.status(500).json({ error: 'Unable to fetch activities' });
  }
});

app.get('/api/leaderboard/', async (_req, res) => {
  try {
    const leaderboard = await LeaderboardEntry.find().populate('user', 'name').sort({ rank: 1 }).lean();
    res.json({ leaderboard });
  } catch (error) {
    console.error('Fetch leaderboard error:', error);
    res.status(500).json({ error: 'Unable to fetch leaderboard' });
  }
});

app.get('/api/workouts/', async (_req, res) => {
  try {
    const workouts = await Workout.find().lean();
    res.json({ workouts });
  } catch (error) {
    console.error('Fetch workouts error:', error);
    res.status(500).json({ error: 'Unable to fetch workouts' });
  }
});

connectDatabase()
  .then(() => {
    console.log(`Connected to MongoDB`);
    console.log(`API base URL is ${apiBaseUrl}`);
    app.listen(PORT, () => {
      console.log(`Backend server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

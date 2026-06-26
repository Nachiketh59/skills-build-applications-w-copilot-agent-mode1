import mongoose from 'mongoose';
import User from '../models/user';
import Team from '../models/team';
import Activity from '../models/activity';
import Workout from '../models/workout';
import LeaderboardEntry from '../models/leaderboard';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';

async function seed() {
  console.log('Seed the octofit_db database with test data');

  await mongoose.connect(MONGODB_URI);
  console.log(`Connected to MongoDB at ${MONGODB_URI}`);

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    Workout.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
  ]);

  const users = await User.create([
    { name: 'Aiden Harper', email: 'aiden@example.com', role: 'runner', totalPoints: 1540 },
    { name: 'Mia Torres', email: 'mia@example.com', role: 'swimmer', totalPoints: 1360 },
    { name: 'Noah Patel', email: 'noah@example.com', role: 'yogi', totalPoints: 1210 },
  ]);

  const teams = await Team.create([
    { name: 'Octo Warriors', description: 'A competitive crew chasing daily fitness goals.', members: [users[0]._id, users[1]._id] },
    { name: 'Aqua Pulse', description: 'Focused on swimming and recovery.', members: [users[2]._id] },
  ]);

  await User.updateMany(
    { _id: { $in: teams[0].members } },
    { team: teams[0]._id }
  );
  await User.updateOne(
    { _id: users[2]._id },
    { team: teams[1]._id }
  );

  const activities = await Activity.create([
    { user: users[0]._id, type: 'running', durationMinutes: 48, caloriesBurned: 410, date: new Date('2026-06-20T07:30:00Z') },
    { user: users[1]._id, type: 'swimming', durationMinutes: 35, caloriesBurned: 290, date: new Date('2026-06-21T09:00:00Z') },
    { user: users[2]._id, type: 'yoga', durationMinutes: 55, caloriesBurned: 220, date: new Date('2026-06-22T06:45:00Z') },
  ]);

  const workouts = await Workout.create([
    {
      name: 'Sunrise Sprint',
      category: 'Cardio',
      durationMinutes: 30,
      difficulty: 'Intermediate',
      exercises: ['Warm-up jog', 'Intervals', 'Cool-down stretch'],
    },
    {
      name: 'Deep Stretch Flow',
      category: 'Flexibility',
      durationMinutes: 40,
      difficulty: 'Beginner',
      exercises: ['Breathing', 'Hip openers', 'Spinal twists'],
    },
  ]);

  await LeaderboardEntry.create([
    { user: users[0]._id, rank: 1, points: 1540, weeklyChange: 18 },
    { user: users[1]._id, rank: 2, points: 1360, weeklyChange: 12 },
    { user: users[2]._id, rank: 3, points: 1210, weeklyChange: 8 },
  ]);

  console.log('Seed data created successfully.');
  console.log({ users, teams, activities, workouts });

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error('Seed script failed:', error);
  process.exit(1);
});

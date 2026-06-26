import { Schema, model, Document, Types } from 'mongoose';

export interface IWorkout extends Document {
  name: string;
  category: string;
  durationMinutes: number;
  difficulty: string;
  exercises: string[];
}

const workoutSchema = new Schema<IWorkout>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    difficulty: { type: String, required: true },
    exercises: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default model<IWorkout>('Workout', workoutSchema);

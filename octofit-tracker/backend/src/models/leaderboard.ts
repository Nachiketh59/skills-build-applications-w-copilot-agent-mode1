import { Schema, model, Document, Types } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  user: Types.ObjectId;
  rank: number;
  points: number;
  weeklyChange: number;
}

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rank: { type: Number, required: true },
    points: { type: Number, required: true },
    weeklyChange: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema);

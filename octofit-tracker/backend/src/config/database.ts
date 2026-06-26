import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/octofit_db';

mongoose.set('strictQuery', false);

export async function connectDatabase() {
  return mongoose.connect(MONGODB_URI);
}

export default mongoose;

import 'dotenv/config';
import mongoose from 'mongoose';
import { User, UserSchema } from '../user.schema.js';

const connectToDatabase = async () => {
  const MONGODB_URI =
    process.env.MONGO_URI ?? 'mongodb://localhost:27017/myapp';
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
};
const seedUser = async () => {
  const UserModel =
    mongoose.models.User ?? mongoose.model(UserSchema.name, User);
  const husband = await UserModel.findOneAndUpdate(
    { email: 'kiettruong100702@gmail.com' },
    {
      $set: {
        userId: 'USR00001',
        name: 'Truong Kiet',
        email: 'kiettruong100702@gmail.com',
        passwordHash: 'hashed_password',
        phone: '0704875988',
      },
    },
    { upsert: true, new: true, runValidators: true },
  );
  return husband;
};
async function seed() {
  try {
    await connectToDatabase();
    // seed user
    const husband = await seedUser();
    console.log('Husband:', husband);

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();

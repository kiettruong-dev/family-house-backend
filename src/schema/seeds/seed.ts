import 'dotenv/config';
import mongoose, { ObjectId } from 'mongoose';
import { User, UserSchema } from '../user.schema';
import { FamilyStatus } from '../../common/enums/family.enum';
import { Family, FamilySchema } from '../families.schema';
import { PasswordHasher } from '@nestjs/authentication';
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
        passwordHash: await new PasswordHasher().hash('password123'),
        phone: '0704875988',
      },
    },
    { upsert: true, new: true, runValidators: true },
  );
  return husband;
};

const seedFamily = async (husband: UserSchema & { _id: ObjectId }) => {
  const FamilyModel =
    mongoose.models.Family ?? mongoose.model(FamilySchema.name, Family);
  const family = await FamilyModel.findOneAndUpdate(
    { name: 'Truong Family' },
    {
      $set: {
        name: 'Truong Family',
        createdBy: husband._id,
        status: FamilyStatus.ACTIVE,
        settings: {
          currency: 'VND',
          timezone: 'Asia/Ho_Chi_Minh',
        },
      },
    },
    { upsert: true, new: true, runValidators: true },
  );
  return family;
};

async function seed() {
  try {
    await connectToDatabase();
    // seed user
    const husband = await seedUser();
    console.log('Husband:', husband);

    // seed family
    const family = await seedFamily(husband);
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

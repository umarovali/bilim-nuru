/**
 * Creates (or updates) the initial admin account, using
 * ADMIN_USERNAME / ADMIN_PASSWORD from .env
 *
 * Run with: npm run seed:admin
 */
import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminSchema } from '../auth/schemas/admin.schema';

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/bilim-nuru';
  await mongoose.connect(uri);

  const AdminModel = mongoose.model(Admin.name, AdminSchema);

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await AdminModel.findOne({ username });
  if (existing) {
    existing.passwordHash = passwordHash;
    await existing.save();
    console.log(`Пароль администратора "${username}" обновлён.`);
  } else {
    await AdminModel.create({ username, passwordHash });
    console.log(`Администратор "${username}" создан.`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

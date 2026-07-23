import process from "node:process";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "../src/config/env.js";
import { User } from "../src/models/user.model.js";

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error('Usage: npm run create-admin -- "Full Name" admin@example.com "strong-password"');
  process.exitCode = 1;
} else if (password.length < 12) {
  console.error("Administrator passwords must contain at least 12 characters.");
  process.exitCode = 1;
} else {
  try {
    await mongoose.connect(env.mongoUri);
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      existing.name = name.trim();
      existing.passwordHash = passwordHash;
      existing.role = "admin";
      await existing.save();
      console.log(`Administrator updated: ${normalizedEmail}`);
    } else {
      await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "admin"
      });
      console.log(`Administrator created: ${normalizedEmail}`);
    }
  } catch (error) {
    console.error("Administrator provisioning failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

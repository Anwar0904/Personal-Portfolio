import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { Role } from "@/models/role.model";
import { env } from "@/config/env";

async function seed() {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(uri, {
      dbName: env.MONGODB_DB,
    });

    // Remove old roles
    await Role.deleteMany({});

    // Insert default roles
    await Role.insertMany([
      {
        "name": "super admin",
        "description": "Full system access",
        "permissions": [],
        "isDefault": false,
        "status": "active"
      },
      {
        "name": "admin",
        "description": "Administrator",
        "permissions": [],
        "isDefault": false,
        "status": "active"
      },
      {
        "name": "user",
        "description": "Default user",
        "permissions": [],
        "isDefault": true,
        "status": "active"
      },
    ]);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
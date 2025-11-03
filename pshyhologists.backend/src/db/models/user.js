// src/db/models/user.js

import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['psychologist', 'client'], required: true },
  },
  {
    timestamps: true,
  },
);

export const UserCollection = model('users', usersSchema);

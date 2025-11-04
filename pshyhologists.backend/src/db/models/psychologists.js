// src/db/models/psyhologists.js
import { model, Schema } from 'mongoose';
import { ReviewSchema } from './review.js';

const urlRegex = /^(https?:\/\/)([\w.-]+)(:[0-9]+)?(\/[\w\-./%?&=]*)?$/i;

const psychologistsSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    avatar_url: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || urlRegex.test(v),
        message: 'avatar_url must be a valid URL',
      },
    },
    experience: { type: String, required: true, trim: true },

    price_per_hour: { type: Number, required: true, min: 0 },
    reviews: { type: [ReviewSchema], default: [] },

    rating: { type: Number, default: 0, min: 0, max: 5 },

    license: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },

    initial_consultation: { type: String, trim: true },
    about: { type: String, required: true, trim: true, maxlength: 8000 },
    ParentUserId: { type: Schema.Types.ObjectId, ref: 'users' },
  },
  {
    collection: 'psychologists',
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const PsychologistsCollection = model(
  'psychologists',
  psychologistsSchema,
);

import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, enum: ['Celestial Body', 'Orbit', 'Space Hotel', 'Other'], required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    image: { type: String },
    gallery: [{ type: String }],
    distanceFromEarth: { type: String },
    travelDuration: { type: String },
    gravity: { type: String },
    temperature: { type: String },
    atmosphere: { type: String },
    highlights: [{ type: String }],
    experiences: [experienceSchema],
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;

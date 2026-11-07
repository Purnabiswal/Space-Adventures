import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo: { type: String },
    coverImage: { type: String },
    tagline: { type: String },
    type: { type: String, enum: ['Government', 'Private'], required: true },
    headquarters: { type: String },
    founded: { type: Number },
    about: { type: String },
    realWorldScope: { type: String },
    fictionalDisclaimer: { type: String },
    futureConcepts: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Company = mongoose.model('Company', companySchema);
export default Company;

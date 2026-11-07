import mongoose from 'mongoose';

const categoryConfigSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    count: { type: Number, default: 2 }, // number of questions of this category per attempt
  },
  { _id: false }
);

const assessmentConfigSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Astronaut Readiness Assessment' },
    isActive: { type: Boolean, default: true },
    passingScore: { type: Number, default: 70 }, // percentage
    totalQuestions: { type: Number, default: 10 },
    durationMinutes: { type: Number, default: 15 },
    categories: [categoryConfigSchema],
    cooldownDays: { type: Number, default: 7 },
  },
  { timestamps: true }
);

const AssessmentConfiguration = mongoose.model('AssessmentConfiguration', assessmentConfigSchema);
export default AssessmentConfiguration;

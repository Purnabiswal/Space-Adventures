import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    category: { type: String, required: true }, // General, Physics, Biology, Safety, etc.
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true, min: 0 },
    explanation: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

questionSchema.index({ category: 1 });

const Question = mongoose.model('Question', questionSchema);
export default Question;

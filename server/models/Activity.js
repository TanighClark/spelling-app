import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    words: {
      type: [String],
      required: true,
    },
    type: {
      type: String,
      enum: ['Fill-in-the-Blank', 'Word Search', 'Matching'],
      required: true,
    },
    generatedContent: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;

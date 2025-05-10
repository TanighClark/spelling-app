import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const templateSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  words: [{ type: String, required: true }],
  activityType: {
    type: String,
    enum: [
      'fillInBlanks',
      'wordSearch',
      'scrambledWords',
      'fillingLetters',
      'writeSentence',
      'writingFourTimes',
      'spellingTest',
      'alphabeticalOrder',
    ],
    required: true,
  },
  instructions: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default model('Template', templateSchema);

import mongoose, { Schema } from 'mongoose';

export interface ICardSchema {
  word: string,
  translation: string,
  image: string,
  audioSrc: string,
  category: string,
  trainCount: number,
  successCount: number,
  failCount: number,
  percentSuccess: number
  image_Id: string,
  audioSrc_Id: string,
}

const CardSchema: Schema = new Schema({
  word: { type: String, required: true },
  translation: { type: String, required: true },
  image: { type: String, required: true },
  audioSrc: { type: String, required: true },
  category: { type: String, required: true },
  trainCount: { type: Number, required: true, default: 0 },
  successCount: { type: Number, required: true, default: 0 },
  failCount: { type: Number, required: true, default: 0 },
  percentSuccess: { type: Number, required: true, default: 0 },
  image_Id: { type: String, required: true },
  audioSrc_Id: { type: String, required: true },
});

module.exports = mongoose.model<ICardSchema>('Card', CardSchema);

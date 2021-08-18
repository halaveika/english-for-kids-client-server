import mongoose, { Schema } from 'mongoose';

export interface ICategorySchema {
  category: string,
  wordsNumber: number,
}

const CategorySchema: Schema = new Schema({
  category: { type: String, unique: true },
  wordsNumber: { type: Number },
});

module.exports = mongoose.model<ICategorySchema>('Category', CategorySchema);

import { Request, Response } from 'express';
import { ICategorySchema } from '../models/category';
import { ICardSchema } from '../models/card';

const { cloudinary } = require('../utils/cloudinary');
const Category = require('../models/category');
const Card = require('../models/card');

export interface IData {
  word: string; translation: string; image: string; audioSrc: string
}

export interface IContent {
  category: string;
  data: IData[];
}

export interface IGetCategory {
  category: string;
  wordsNumber: number;
}

class CategoryController {
  async getData(req:Request, res:Response) {
    try {
      const categories:ICategorySchema[] = await Category.find({});
      const cards:ICardSchema[] = await Card.find({});
      const result :IContent[] = [];
      categories.forEach((element) => {
        const filterCards:IData[] = []; cards.forEach((item) => {
          if (element.category === item.category) {
            filterCards.push({
              word: item.word, translation: item.translation, image: item.image, audioSrc: item.audioSrc,
            });
          }
        }); result.push({ category: element.category, data: filterCards });
      });
      return res.send(result);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Can not get content' });
    }
  }

  async getCategory(req:Request, res:Response) {
    try {
      const number = <string>req.query.number;
      const categoryArr:ICategorySchema[] = await Category.find({});
      categoryArr.splice(parseInt(number, 10), categoryArr.length);
      const result: IGetCategory[] = [];
      categoryArr.forEach((element) => result.push({ category: element.category, wordsNumber: element.wordsNumber }));
      return res.send(result);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: 'Can not get category' });
    }
  }

  async createCategory(req:Request, res:Response) {
    try {
      const number = <string>req.query.number;
      const title = <string>req.query.title;
      const isInDB = await Category.findOne({ category: title });
      if (isInDB) { throw new Error('Such category exist'); }
      const category = new Category({ category: title, wordsNumber: 0 });
      await category.save();
      const categoryArr:ICategorySchema[] = await Category.find({});
      categoryArr.splice(parseInt(number, 10), categoryArr.length);
      const result: IGetCategory[] = [];
      categoryArr.forEach((element) => result.push({ category: element.category, wordsNumber: element.wordsNumber }));
      return res.send(result);
    } catch (e) {
      console.log(e);
      return res.status(400).json(e);
    }
  }

  async deleteCategory(req:Request, res:Response) {
    try {
      const number = <string>req.query.number;
      const title = <string>req.query.title;
      const category:ICategorySchema = await Category.findOne({ category: title });
      if (!category) {
        return res.status(400).json({ message: 'category not found' });
      }
      const cards = await Card.find({ category: title });
      cards.forEach(async (card:ICardSchema) => {
        await cloudinary.uploader.destroy(card.image_Id, { invalidate: true, resource_type: 'image' });
        await cloudinary.uploader.destroy(card.audioSrc_Id, { invalidate: true, resource_type: 'video' });
      });
      await Card.deleteMany({ category: title });
      await Category.deleteOne(category);
      const categoryArr:ICategorySchema[] = await Category.find({});
      categoryArr.splice(parseInt(number, 10), categoryArr.length);
      const result: IGetCategory[] = [];
      categoryArr.forEach((element) => result.push({ category: element.category, wordsNumber: element.wordsNumber }));
      return res.send(result);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: `category was not deleted${e}` });
    }
  }

  async updateCategory(req:Request, res:Response) {
    try {
      const number = <string>req.query.number;
      const title = <string>req.query.title;
      const newTitle = <string>req.query.newTitle;
      const category = await Category.findOne({ category: title });
      if (!category) {
        return res.status(400).json({ message: 'category not found' });
      }
      const cards:ICardSchema[] = await Card.find({ category: title });
      cards.forEach(async (element) => {
        await Card.findOneAndUpdate({ category: element.category }, { category: newTitle });
      });
      await category.updateOne({ category: newTitle });
      const categoryArr:ICategorySchema[] = await Category.find({});
      categoryArr.splice(parseInt(number, 10), categoryArr.length);
      const result: IGetCategory[] = [];
      categoryArr.forEach((element) => result.push({ category: element.category, wordsNumber: element.wordsNumber }));
      return res.send(result);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }
}
export default new CategoryController();

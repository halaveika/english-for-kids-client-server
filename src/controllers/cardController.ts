import { Request, Response } from 'express';
import { ICardSchema } from '../models/card';

const Card = require('../models/card');
const Category = require('../models/category');
const { cloudinary } = require('../utils/cloudinary');

export interface IWordRes {
  word: string;
  translation: string;
  image: string;
  audioSrc: string;
  category: string;
}

class CardController {
  async getCard(req:Request, res:Response) {
    try {
      const number = <string>req.query.number;
      const category = <string>req.query.category;
      const cardArr:ICardSchema[] = await Card.find({ category });
      cardArr.splice(parseInt(number, 10), cardArr.length);
      const result: IWordRes[] = [];
      cardArr.forEach((element) => result.push({
        word: element.word,
        translation: element.translation,
        image: element.image,
        audioSrc: element.audioSrc,
        category: element.category,
      }));
      return res.send(result);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: `Can not get cards${e}` });
    }
  }

  async createCard(req:Request, res:Response) {
    try {
      const {
        word, category, translation, number,
      } = req.body;
      const files = req.files! as { [fieldname: string]: Express.Multer.File[] };
      const uploadImg = await cloudinary.uploader.upload(files.img[0].path, { resource_type: 'image' });
      const uploadAudio = await cloudinary.uploader.upload(files.audio[0].path, { resource_type: 'video' });
      const newDBCard = new Card({
        word,
        translation,
        image: uploadImg.url,
        audioSrc: uploadAudio.url,
        category,
        image_Id: uploadImg.public_id,
        audioSrc_Id: uploadAudio.public_id,
      });
      const cardCategory = await Category.findOne({ category });
      const newWordsNumber = cardCategory.wordsNumber + 1;
      await Category.findOneAndUpdate({ category }, { wordsNumber: newWordsNumber });
      await newDBCard.save();
      const cardArr:ICardSchema[] = await Card.find({ category });
      cardArr.splice(parseInt(number, 10), cardArr.length);
      const result: IWordRes[] = [];
      cardArr.forEach((element) => result.push({
        word: element.word,
        translation: element.translation,
        image: element.image,
        audioSrc: element.audioSrc,
        category: element.category,
      }));
      return res.send(result);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: e });
    }
  }

  async deleteCard(req:Request, res:Response) {
    try {
      const number = <string>req.query.number;
      const category = <string>req.query.category;
      const word = <string>req.query.word;
      const card = await Card.findOne({ word, category });
      if (!card) { throw new Error('Card not found to delite'); }
      await cloudinary.uploader.destroy(card.image_Id, { invalidate: true, resource_type: 'image' });
      await cloudinary.uploader.destroy(card.audioSrc_Id, { invalidate: true, resource_type: 'video' });
      const categoryUpdate = await Category.findOne(
        { category },
      );
      await Category.findOneAndUpdate(
        { category },
        { wordsNumber: categoryUpdate.wordsNumber - 1 },
      );
      await card.remove();
      const cardArr:ICardSchema[] = await Card.find({ category });
      cardArr.splice(parseInt(number, 10), cardArr.length);
      const result: IWordRes[] = [];
      cardArr.forEach((element) => result.push({
        word: element.word,
        translation: element.translation,
        image: element.image,
        audioSrc: element.audioSrc,
        category: element.category,
      }));
      return res.send(result);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: `Cannot delete card${e}` });
    }
  }

  async updateCard(req:Request, res:Response) {
    try {
      const {
        word, category, newWord, newTranslation, number,
      } = req.body;
      const files = req.files! as { [fieldname: string]: Express.Multer.File[] };
      const card = await Card.findOne({ word, category });
      if (newTranslation) { await card!.updateOne({ translation: newTranslation }); }
      if (files.img) {
        await cloudinary.uploader.destroy(card.image, { invalidate: true, resource_type: 'image' });
        const uploadImg = await cloudinary.uploader.upload(files.img[0].path, { resource_type: 'image' });
        await card.updateOne({ image: uploadImg.url, image_Id: uploadImg.public_id });
      }
      if (files.audio) {
        await cloudinary.uploader.destroy(card.audio, { invalidate: true, resource_type: 'video' });
        const uploadAudio = await cloudinary.uploader.upload(files.audio[0].path, { resource_type: 'video' });
        await card.updateOne({ audioSrc: uploadAudio.url, audioSrc_Id: uploadAudio.public_id });
      }
      if (newWord) { await card!.updateOne({ word: newWord }); }
      const cardArr:ICardSchema[] = await Card.find({ category });
      cardArr.splice(parseInt(number, 10), cardArr.length);
      const result: IWordRes[] = [];
      cardArr.forEach((element) => result.push({
        word: element.word,
        translation: element.translation,
        image: element.image,
        audioSrc: element.audioSrc,
        category: element.category,
      }));
      return res.send(result);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: `Upload error${e}` });
    }
  }
}
export default new CardController();

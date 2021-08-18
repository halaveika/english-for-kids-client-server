import { Request, Response } from 'express';
import { ICardSchema } from '../models/card';

const Card = require('../models/card');

export interface IStatWord {
  word: string,
  translation: string,
  category: string,
  trainCount: number,
  successCount: number,
  failCount: number,
  percentSuccess: number
}

class StatController {
  async getStat(req:Request, res:Response) {
    try {
      const cards:ICardSchema[] = await Card.find({});
      const result :IStatWord[] = [...cards];
      return res.send(result);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: `Can not get statistic${e}` });
    }
  }

  async updateStat(req:Request, res:Response) {
    try {
      const {
        word, category, trainCount, successCount, failCount,
      } = req.body;
      const card = await Card.findOne({ word, category });
      const newTrainCount = trainCount + card.trainCount;
      const newSuccessCount = successCount + card.successCount;
      const newFailCount = failCount + card.failCount;
      let newPercentSuccess = 0;
      if (newSuccessCount) {
        newPercentSuccess = parseFloat(((100 * newSuccessCount)
        / (newSuccessCount + newFailCount)).toFixed(2));
      }
      await Card.updateOne({ word, category }, {
        trainCount: newTrainCount,
        successCount: newSuccessCount,
        failCount: newFailCount,
        percentSuccess: newPercentSuccess,
      });
      const cards:ICardSchema[] = await Card.find({});
      const result :IStatWord[] = [...cards];
      return res.send(result);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: e });
    }
  }

  async resetStat(req:Request, res:Response) {
    try {
      const cards :ICardSchema[] = await Card.find({});
      const result :IStatWord[] = [];
      cards.forEach((element) => {
        result.push({
          word: element.word,
          translation: element.translation,
          category: element.category,
          trainCount: 0,
          successCount: 0,
          failCount: 0,
          percentSuccess: 0,
        });
      });
      return res.send(result);
    } catch (e) {
      return res.status(500).json({ message: `Can not get statistic${e}` });
    }
  }
}
export default new StatController();

import express from 'express';
import mongoose from 'mongoose';
import bodyparser from 'body-parser';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import authRoute from './routes/authRoute';
import categoryRoute from './routes/categoryRoute';
import cardRoute from './routes/cardRoute';
import statRoute from './routes/statRoute';
import { default as swaggerDocument } from './swagger.json';

const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(cors());
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/api/auth', authRoute);
app.use('/api/category', categoryRoute);
app.use('/api/card', cardRoute);
app.use('/api/stat', statRoute);

const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await mongoose
      .connect('mongodb+srv'
      + '://halaveika:43141231@cluster0.ghats.mongodb.net/'
      + 'english-for-kids-halaveika?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();

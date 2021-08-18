import { Router } from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware';
import CardController from '../controllers/cardController';

const upload = require('../utils/multer');

const cpUpload = upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'img', maxCount: 1 }]);
const cardRoute = Router();
cardRoute.post('/upload', cpUpload, CardController.createCard);
cardRoute.get('', AuthMiddleware, CardController.getCard);
cardRoute.put('/upload', AuthMiddleware, cpUpload, CardController.updateCard);
cardRoute.delete('', AuthMiddleware, CardController.deleteCard);

export default cardRoute;

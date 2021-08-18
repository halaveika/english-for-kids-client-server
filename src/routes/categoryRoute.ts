import { Router } from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware';
import CategoryController from '../controllers/categoryController';

const categoryRoute = Router();

categoryRoute.get('/content', CategoryController.getData);
categoryRoute.post('', AuthMiddleware, CategoryController.createCategory);
categoryRoute.get('', AuthMiddleware, CategoryController.getCategory);
categoryRoute.put('', AuthMiddleware, CategoryController.updateCategory);
categoryRoute.delete('', AuthMiddleware, CategoryController.deleteCategory);

export default categoryRoute;

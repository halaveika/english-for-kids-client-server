import { Router } from 'express';
import StatController from '../controllers/statController';

const categoryRoute = Router();

categoryRoute.get('', StatController.getStat);
categoryRoute.put('', StatController.updateStat);
categoryRoute.delete('', StatController.resetStat);

export default categoryRoute;

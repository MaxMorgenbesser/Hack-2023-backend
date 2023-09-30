import { Router } from 'express';
import { getScreenings, postScreenings } from './ScreeningService';
import { TokenWare } from '../Middlewares/TokenWare';

export const screeningRouter = Router();

screeningRouter.get('/', TokenWare, getScreenings);

screeningRouter.post('/', TokenWare, postScreenings);

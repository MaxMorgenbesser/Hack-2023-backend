import { Router } from 'express';
import { getActivities, updateFields } from './ActivityService';
import { TokenWare } from '../Middlewares/TokenWare';

const ActivityRouter = Router();

ActivityRouter.get('/:_id',TokenWare, getActivities);
ActivityRouter.put('/:_id', TokenWare, updateFields);
 
export default ActivityRouter;

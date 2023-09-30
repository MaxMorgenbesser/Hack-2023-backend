import * as functions from 'firebase-functions';
import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import UserRouter from './src/user/UserRouter';
import { screeningRouter } from './src/screening/ScreeningRouter';
import ActivityRouter from './src/Activities/ActivityRouter';

dotenv.config();
const app: Express = express();

app.use(cors());
app.use(express.json());



app.use('/user', UserRouter);
app.use('/screening', screeningRouter);
app.use('/activity', ActivityRouter )


export const api = functions.https.onRequest(app);

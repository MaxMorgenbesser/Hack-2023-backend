import * as functions from 'firebase-functions';
import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import UserRouter from './src/user/UserRouter';
import { screeningRouter } from './src/screening/ScreeningRouter';

dotenv.config();
const app: Express = express();

app.use(cors());
app.use(express.json());

// const port = process.env.PORT

app.use('/user', UserRouter);
app.use('/screening', screeningRouter);

// app.listen(8080, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${8080}`);
// });

export const api = functions.https.onRequest(app);

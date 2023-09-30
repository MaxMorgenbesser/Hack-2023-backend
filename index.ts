import * as functions from 'firebase-functions';
import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import UserRouter from './src/user/UserRouter';

dotenv.config();
const app: Express = express();

app.use(cors());
app.use(express.json());

// const port = process.env.PORT

app.use('/user', UserRouter);

// app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
// });

export const api = functions.https.onRequest(app);

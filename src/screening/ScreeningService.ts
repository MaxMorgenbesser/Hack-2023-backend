import { Request, Response } from 'express';
import { UserContext } from '../utils/user-context';
import DbConnect from '../dbconnect/dbconnect';
import { log } from 'console';
import { JwtPayload } from 'jsonwebtoken';

export const getScreenings = async (req: Request, res: Response) => {};

export const postScreenings = async (req: Request, res: Response) => {
  if (!req.body) {
    res.status(401).send({ error: 'Bad request' });
    return;
  }

  const { lastScreeningDate, screened } = req.body;
  // get user Id from token
  const user = UserContext.get();
  // save to data base
  const { collection: ScreeningCollection, client } = DbConnect(
    'screening',
    'Hack2023'
  );

  const payload = {
    userId: (user as JwtPayload)?._id,
    lastScreeningDate,
    createdAt: Date.now(),
    screened,
  };

  console.log(user);

  const result = await ScreeningCollection.insertOne(payload);

  await client.close();

  res.status(201).send({
    success: result.acknowledged,
    data: { ...payload },
  });
};

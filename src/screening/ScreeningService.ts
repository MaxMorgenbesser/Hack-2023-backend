import { Request, Response } from 'express';
import { UserContext } from '../utils/user-context';
import DbConnect from '../dbconnect/dbconnect';
import { log } from 'console';
import { JwtPayload } from 'jsonwebtoken';
import { InsertOneResult, UpdateResult } from 'mongodb';

export const getScreenings = async (req: Request, res: Response) => {
  const user = UserContext.get();
  const userId = (user as JwtPayload)._id;

  const { collection: ScreeningCollection, client } = DbConnect(
    'screening',
    'Hack2023'
  );

  const result = await ScreeningCollection.findOne({ userId });

  await client.close();

  res.status(200).send({ success: !!result?._id, data: { ...result } });
};

export const postScreenings = async (req: Request, res: Response) => {
  if (!req.body) {
    res.status(401).send({ error: 'Bad request' });
    return;
  }

  const { lastScreeningDate, screened } = req.body;
  // get user Id from token
  const user = UserContext.get();
  const userId = (user as JwtPayload)?._id;
  // save to data base
  const { collection: ScreeningCollection, client } = DbConnect(
    'screening',
    'Hack2023'
  );

  const payload = {
    userId,
    lastScreeningDate,
    createdAt: Date.now(),
    screened,
  };

  const screening = await ScreeningCollection.find({ userId }).toArray();
  let result: InsertOneResult<Document> | UpdateResult<Document>;

  if (!screening.length) {
    result = await ScreeningCollection.insertOne({ ...payload });
  } else {
    result = await ScreeningCollection.updateOne(
      { userId },
      { $set: { ...payload } }
    );
  }

  console.log(result);

  await client.close();

  res.status(201).send({
    success: result.acknowledged,
    data: { ...payload },
  });
};

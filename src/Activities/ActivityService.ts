import { ObjectId } from 'mongodb';
import DbConnect from '../dbconnect/dbconnect';
import { Request, Response } from 'express';
import { ActivityModel } from '../models/activities.models';

function sameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function DateFunction() {
  return new Date();
}

export const getActivities = async (req: Request, res: Response) => {
  const { _id } = req.params;
  if (!_id) {
    res.status(422).send({ error: 'missing _id' });
    return;
  }
  const { collection: ActivitiesCollection, client: ActivitesClient } =
    DbConnect('activities', 'Hack2023');

  const usersActivities = await ActivitiesCollection.findOne({ user_id: _id });

  if (usersActivities && sameDay(usersActivities?.date, DateFunction())) {
    res.status(200).send({ success: true, activities: usersActivities });
    await ActivitesClient.close();
    return;
  } else if (usersActivities) {
    const id = new ObjectId(usersActivities?._id);
    const data: ActivityModel = {
      _id: id,
      water: { checked: false, value: false },
      exercise: { checked: false, value: false },
      sleep: { checked: false, value: false },
      nondrinker: { checked: false, value: false },
      nonsmoker: { checked: false, value: false },
      sunscreen: { checked: false, value: false },
    };

    await ActivitiesCollection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          date: DateFunction(),
          ...data,
        },
      }
    );
    res
      .status(200)
      .send({ success: true, activities: { date: DateFunction(), ...data } });
    await ActivitesClient.close();
    return;
  } else {
    const data: ActivityModel = {
      water: { checked: false, value: false },
      exercise: { checked: false, value: false },
      sleep: { checked: false, value: false },
      nondrinker: { checked: false, value: false },
      nonsmoker: { checked: false, value: false },
      sunscreen: { checked: false, value: false },
      date: DateFunction(),
      user_id: _id,
    };
    const inserted = await ActivitiesCollection.insertOne({ ...data });
    res.status(200).send({
      success: true,
      _id: inserted.insertedId,
      activities: { ...data, date: DateFunction() },
    });
    await ActivitesClient.close();
    return;
  }
};

export const updateFields = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const fields = req.body;
  if (!_id) {
    res.status(422).send({ error: 'missing ID' });
    return;
  }
  const { collection: ActivitiesCollection, client: ActivitesClient } =
    DbConnect('activities', 'Hack2023');

  const id = new ObjectId(_id);
  const values = await ActivitiesCollection.findOneAndUpdate(
    { _id: id },
    {
      $set: fields,
    }
  );

  if (!values) {
    res.status(200).send({ success: false });
    await ActivitesClient.close();
    return;
  }

  res.status(200).send({ success: true, fields: fields });
  await ActivitesClient.close();
  return;
};

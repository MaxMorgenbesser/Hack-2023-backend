import { Request, Response } from "express";

import DbConnect from "../dbconnect/dbconnect";
import cryptojs from "crypto-js";
import jwt from "jsonwebtoken";
import TwilioClient from "../utils/twilioClient";
import { ObjectId } from "mongodb";
import { UserModel } from "../models/userModels";

const jwtSecret = process.env.JWT_SECRET as string;
const cryptoKey = process.env.CRYPTO_KEY as string;
const verifySid = process.env.TWILIO_VERIFY_SID as string;

export const verifyNumber = async (req: Request, res: Response) => {
  if (!req.body?.number || !req.body?.countryCode) {
    res.status(422).send({ error: "missing fields" });
    return;
  }

  TwilioClient.verify.v2
    .services(verifySid)
    .verifications.create({
      to: req.body?.countryCode + req.body?.number,
      channel: "sms",
    })
    .then()
    .catch((err: any) => {
      console.error(err);
      res.status(400).send({ err: err });
      return;
    });

  const { collection: UserCollection, client: userClient } = DbConnect(
    "user",
    "Hack2023"
  );

  let ThisUser: any;
  let users = await UserCollection.find().toArray();

  users.map((user) => {
    if (user?.number) {
      let NumBytes = cryptojs.AES.decrypt(user.number, cryptoKey);
      let decodednumber = NumBytes.toString(cryptojs.enc.Utf8);
      if (decodednumber == req.body.number) {
        ThisUser = user;
        return;
      }
    }
  });

  if (!ThisUser) {
    let ciphernumber;
    ciphernumber = cryptojs.AES.encrypt(req.body.number, cryptoKey).toString();
    const newUser = await UserCollection.insertOne({
      countryCode: req.body.countryCode,
      number: ciphernumber,
    });
    const token = jwt.sign({ _id: newUser.insertedId }, jwtSecret);
    res.status(200).send({ success: true, temptoken: token });
  } else {
    const token = jwt.sign({ _id: ThisUser?._id }, jwtSecret);
    res.status(200).send({ success: true, temptoken: token });
  }
  await userClient.close();
};

export const login = async (req: Request, res: Response) => {
  const { _id } = req.params;
  const { pin } = req.body;
  console.log(pin.length);
  if (!_id || !pin) {
    res.status(422).send({ error: "Missing fields" });
    return;
  }
  const { collection: UserCollection, client: userClient } = DbConnect(
    "user",
    "Hack2023"
  );

  const id = new ObjectId(_id);
  const user: any = await UserCollection.findOne({ _id: id });

  if (!user) {
    res.status(422).send({ error: "User not found" });
    await userClient.close();
    return;
  }
  console.log(user);
  let NumBytes = cryptojs.AES.decrypt(user.number, cryptoKey);
  const decodednumber = NumBytes.toString(cryptojs.enc.Utf8);

  try {
    const response = await TwilioClient.verify.v2
      .services(verifySid)
      .verificationChecks.create({
        to: user.countryCode + decodednumber,
        code: pin,
      });
    const token = jwt.sign(user, jwtSecret);
    res
      .status(200)
      .send({ success: true, token: token, status: response.status });
  } catch (err) {
    console.error(err);
    res.status(400).send({ success: false, error: err });
  } finally {
    await userClient.close();
  }
};

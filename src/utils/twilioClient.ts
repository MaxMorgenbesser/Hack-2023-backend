import { Twilio } from "twilio";
import dotenv from "dotenv";

dotenv.config();

const TwilioClient = new Twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default TwilioClient;

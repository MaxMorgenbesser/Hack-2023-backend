import { MongoClient } from "mongodb";
import dotenv from 'dotenv'
import { Collections, Database } from "../models/dbconnect.models";

dotenv.config()

 const DbConnect = (collectionName:Collections,databaseName:Database) => {
    const connection_string: string = (process.env.CONNECTION_STRING as string)
    console.log(connection_string)
    const client = new MongoClient(connection_string);
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);
    return { collection:collection, client: client };

  };

  export default DbConnect
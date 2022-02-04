import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoClient = new MongoClient(process.env.MYWALLET_URI);
await mongoClient.connect();
const db = mongoClient.db("MyWallet")

export default db;
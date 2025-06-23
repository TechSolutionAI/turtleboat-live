// lib/getDb.js
import clientPromise from './mongodb';

export default async function getDb() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_NAME);
}

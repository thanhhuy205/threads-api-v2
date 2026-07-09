import configService from '@/config/config';
import { MongoClient } from 'mongodb';

const client = new MongoClient(configService.MONGODB_URI);

export async function connectMongoDB() {
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

export async function closeMongoDB() {
    await client.close();
}

export const collections = (collectionName: string) => {
    return client.db(configService.MONGODB_NAME as string).collection(collectionName);
}
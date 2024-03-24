import { MongoClient, Collection } from 'mongodb';

const uri = 'mongodb://mongo:27017/';
  
const MongoDB = {
  client: null as MongoClient,

  async connect(): Promise<void> {
    console.log({ uri });

    this.client = await MongoClient.connect(uri, { directConnection: true });
  },

  getCollection(collectionName: string): Collection {
    return this.client.db('dev').collection(collectionName);
  },

  disconnect(): Promise<void> {
    return this.client.close();
  },
};

export default MongoDB;

import express from 'express';
import * as uuid from 'uuid';

import db from './db';
import config from './config';

type Schedule = {
  description: string;
  date: string; 
};

const server = express();

db.connect().then(() => {
  console.log('database up!');

  server.use(express.json());

  server.get('/status', async (req, res) => {
    return res.json({ up: true });
  });

  server.post('/schedule', async (req, res) => {
    const { description, date } = req.body;

    await create({ description, date });

    return res.status(201).send();
  });

  server.delete('/schedule/:id', async (req, res) => {
    const { id } = req.params;

    await remove(id);

    return res.status(204).send();
  });

  server.patch('/schedule/:id', async (req, res) => {
    const { id } = req.params;
    const { description, date } = req.body;

    await update(id, { description, date });

    return res.status(200).send();
  });

  server.get('/schedule', async (req, res) => {
    const data = await list();

    return res.status(200).json(data);
  });

  server.get('/schedule/:id', async (req, res) => {
    const { id } = req.params;
    const data = await get(id);

    return res.status(200).json(data);
  });

});

server.listen(config.PORT, () => {
  console.log(`app up and runnig on port ${config.PORT}`);
});

async function create(schedule: Schedule) {
  const collection = db.getCollection('schedule');
  
  console.log(uuid);
  
  const doc = {
    id: uuid.v4(),
    ...schedule,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  await collection.insertOne(doc);
}

async function update(id: string, schedule: Schedule) {
  const collection = db.getCollection('schedule');

  await collection.updateOne({ id }, { 
    $set: {
      ...schedule,
      updated_at: new Date().toISOString()
    }
  });
}

async function remove(id: string) {
  const collection = db.getCollection('schedule');

  await collection.deleteOne({ id });
}

async function list(): Promise<Schedule[]> {
  const collection = db.getCollection('schedule');

  return collection.find({}, { 
    projection: { _id: 0 } 
  }).toArray() as any;
}

async function get(id: string): Promise<Schedule[]> {
  const collection = db.getCollection('schedule');

  return collection.findOne({ id }, { 
    projection: { _id: 0 }
  }) as any;
}

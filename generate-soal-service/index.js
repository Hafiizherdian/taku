const express = require('express');
const { Pool } = require('pg');
const amqp = require('amqplib');
const app = express();
const port = 3001;

const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

app.use(express.json());

app.post('/generate', async (req, res) => {
  const { question } = req.body;
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'questionQueue';

  await channel.assertQueue(queue, { durable: false });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(question)));

  res.send('Question sent to queue');
});

app.listen(port, () => {
  console.log(`Generate Soal Service running on port ${port}`);
});
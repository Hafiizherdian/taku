const express = require('express');
const { Pool } = require('pg');
const amqp = require('amqplib');
const app = express();
const port = 3002;

const pool = new Pool({
  user: 'your_db_user',
  host: 'your_db_host',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

app.use(express.json());

async function consumeQuestions() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'questionQueue';

  await channel.assertQueue(queue, { durable: false });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const question = JSON.parse(msg.content.toString());
      await pool.query('INSERT INTO questions (text) VALUES ($1)', [question]);
      channel.ack(msg);
    }
  });
}

consumeQuestions();

app.listen(port, () => {
  console.log(`Manage Soal Service running on port ${port}`);
});
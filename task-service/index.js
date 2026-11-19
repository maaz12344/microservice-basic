const express = require('express');
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const amqp = require('amqplib');
const bodyParser = require('body-parser');
const app = express()
const port = 3002
const dotenv = require('dotenv');
dotenv.config();


app.use(bodyParser.json());

if (!process.env.TASK_DB_URI) {
    throw new Error('TASK_DB_URI is missing');
}   
mongoose.connect(process.env.TASK_DB_URI) 
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  userId: String,
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', TaskSchema);

let channel , connection;

async function connectRabbitMQWithRetry(retries = 5, delay = 5000) {
    while (retries > 0) {
        try {
            connection = await amqp.connect('amqp://rabbitmq');
            channel = await connection.createChannel();
            await channel.assertQueue('task_created', { durable: true });
            console.log('Connected to RabbitMQ');
            break; // Exit the loop if connection is successful
        } catch (err) {
            console.error('Failed to connect to RabbitMQ, retrying in 5 seconds...', err);
            retries--;
            if (retries === 0) {
                console.error('Max retries reached. Could not connect to RabbitMQ.');
                process.exit(1); // Exit the process if max retries reached
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}


app.post('/tasks', async (req, res) => {
  const { title, description, userId } = req.body;
  try {
    const task = new Task({ title, description, userId });
    await task.save();

    const message = { taskId: task._id, title: task.title, description: task.description, userId: task.userId };
    if(!channel) {
        console.error('RabbitMQ channel is not established. Cannot send message.');
        return res.status(503).send({ error: 'Service unavailable. Please try again later.' });
    }
    channel.sendToQueue('task_created', Buffer.from(JSON.stringify(message)), { persistent: true });

    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.listen(port, () => {
  console.log(`Example task service listening on port ${port}`)
  connectRabbitMQWithRetry(); // Connect to RabbitMQ when the server starts
})
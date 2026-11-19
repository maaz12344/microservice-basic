const express = require('express');
const dns = require('node:dns');
const dotenv = require('dotenv');
dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express()
const port = 3001

app.use(bodyParser.json());


mongoose.connect(process.env.USER_DB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', UserSchema);

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = new User({ name, email });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example user service listening on port ${port}`)
})
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5005;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/lost-and-found';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

const itemsRouter = require('./routes/items');
app.use('/api/items', itemsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const todoRoutes = require('./routes/todoRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize DB
initDb();

// Routes
app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
    res.send('Todo API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

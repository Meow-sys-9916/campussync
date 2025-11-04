const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: [
        'http://localhost:4200', 
        'https://your-app.vercel.app'
    ],
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusSync Backend is running!',
  });
});

app.listen(PORT,() =>{
    console.log('Server running on hhtp://localhost:${PORT}');
    console.log('Health check: http://localhost:&{PORT}/api/health');
});

module.exports = app;


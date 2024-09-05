import express, { json, urlencoded } from 'express';
import { connect, model } from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
connect(MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error(error);
});

// Create a new Express application
const app = express();

// Enable CORS
app.use(cors());

// Enable Helmet middleware
app.use(helmet());

// Enable rate limiting
const limiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

// Parse JSON bodies
app.use(json());
app.use(urlencoded({ extended: true }));

// Create a new Mongoose model for `Log
const Log = model('Log', {
    level: String,
    message: String,
    timestamp: Date,
    device: String
});

const formatLog = (log) => `${log.timestamp} (${log.device}) [${log.level}] ${log.message}`;

// Create a new route that accepts POST requests
app.post('/log', async (req, res) => {
    // Create a new Log document
    const log = new Log({
        level: req.body.level,
        message: req.body.message,
        timestamp: req.body.timestamp,
        device: req.body.device
    });

    // Save the document
    await log.save();

    console.log(formatLog(log));

    // Respond with the document
    res.json(log);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
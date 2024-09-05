import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({path: './.env.test'});

const SERVER_URL = process.env.SERVER_URL;

// Function to hit the log endpoint
async function hitLogEndpoint() {
    try {
        while (true) {
            await axios.post(`${SERVER_URL}/log`, {
                level: 'info',
                message: 'Test log message',
                timestamp: new Date(),
                device: 'test'
            });
            console.log('Log endpoint hit successfully');
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    } catch (error) {
        console.error('Error hitting log endpoint:', error.message);
    }
}

hitLogEndpoint();
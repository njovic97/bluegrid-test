import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
import { transformData } from '../utils/transform';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 600 });

router.get('/', async (req, res) => {
    const cacheKey = 'filesData';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        const response = await axios.get('https://rest-test-eight.vercel.app/api/test');
        const responseData = response.data;

        if (responseData && responseData.items && Array.isArray(responseData.items)) {
            const transformedData = transformData(responseData.items);
            cache.set(cacheKey, transformedData);
            res.json(transformedData);
        } else {
            res.status(500).json({ error: 'Unexpected data format received from API' });
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error message:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
                res.status(error.response.status).json({ error: error.response.data });
            } else {
                res.status(500).json({ error: error.message });
            }
        } else if (error instanceof Error) {
            console.error('Error message:', error.message);
            res.status(500).json({ error: error.message });
        } else {
            console.error('Unexpected error:', error);
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});

export default router;

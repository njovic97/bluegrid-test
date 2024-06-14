import express from 'express';
import filesRouter from './api/files';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/files', filesRouter);

app.get('/', (req, res) => {
    res.send('Transformed data URL: /api/files');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

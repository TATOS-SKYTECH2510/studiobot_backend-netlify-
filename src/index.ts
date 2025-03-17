import express, { Request, Response } from 'express';
import Router from './router';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware to parse JSON requests  
app.use('/', Router);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});  
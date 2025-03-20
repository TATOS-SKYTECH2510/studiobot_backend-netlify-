import express from 'express';
import router from './router';
import dotenv from 'dotenv';
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors())
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});  
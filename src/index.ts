import express from 'express';
import router from './router';
import dotenv from 'dotenv';
import cors from "cors";
import serverless from "serverless-http"
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors())
app.use('/api', router);
export const handler = serverless(app);
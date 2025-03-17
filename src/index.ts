import express, { Request, Response } from 'express';  

const app = express();  
const PORT = process.env.PORT || 3000;  

app.use(express.json()); // Middleware to parse JSON requests  

app.get('/', (req: Request, res: Response) => {  
    res.send('Hello, World!');  
});  

app.listen(PORT, () => {  
    console.log(`Server is running at http://localhost:${PORT}`);  
});  
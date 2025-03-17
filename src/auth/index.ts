
import { Request, Response, NextFunction } from 'express';  
import { supabase } from '../supabaseClient';  

export const auth = async (req: Request, res: Response, next: NextFunction) => {  
    const token = req.headers['authorization']?.split(" ")[1];  

    if (!token) {  
        return res.status(401).json({ message: 'Unauthorized: Token missing' });  
    }  

    // Validate the token via Supabase  
    const { data, error } = await supabase.auth.getUser(token);  

    if (error || !data.user) {  
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });  
    }  
    next();  
};  
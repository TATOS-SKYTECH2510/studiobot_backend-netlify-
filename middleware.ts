import { Request, Response, NextFunction } from 'express';
import { supabase } from './src/supabaseClient';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assume token is passed as `Bearer <token>`  

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}; 
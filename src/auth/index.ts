import { Request, Response, NextFunction } from 'express';
import { supabase } from '../supabaseClient';

// Example auth middleware  
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            res.status(401).json({ message: 'Unauthorized' });
            throw error
        }
        else {
            (req as any).user = {
                ...data.user,
                id: data.user.id,
                role: 'user' // You can set roles dynamically  
            };
            (req as any).user = data.user
        }

        next();
    } catch (err) {
        next(err);
    }
};  
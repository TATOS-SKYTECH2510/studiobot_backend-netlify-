import { User } from '@supabase/supabase-js';
import 'express';

declare global {
    namespace Express {
        interface Request {
            user?: User & {
                id: string;
                role?: string;
            };
        }
    }
}

export { };  
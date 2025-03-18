import { User } from '@supabase/gotrue-js'; // Adjust this import according to your Supabase User type  

declare global {
    namespace Express {
        interface Request {
            user?: User; // Add the user property to the Request interface  
        }
    }
}  
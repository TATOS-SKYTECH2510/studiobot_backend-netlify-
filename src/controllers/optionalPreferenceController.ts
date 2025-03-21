import { Request, Response } from "express";
import { supabase } from "../supabaseClient";

class OptionalPreferenceController {
    static saveOptionalPreferences = async (req: Request, res: Response) => {
        const user = (req as any).user;
        const { preference } = req.body;
        const { data, error } = await supabase
            .from('optional_preferences')
            .insert({ ...preference, user_id: user?.id })
            .select()
            .single();

        if (error) {
            res.status(400).json(error);
        }
        else res.status(200).json(data);
    }
    static getOptionalPreferences = async (req: Request, res: Response) => {
        const user = (req as any).user;
        const { data, error } = await supabase
            .from('optional_preferences')
            .select('*')
            .eq('user_id', user?.id)
            .single();
        if (error)
            res.status(400).json({
                error: error.message
            }
            )
        else res.status(200).json(data);
    }
    static updateOptionalPreferences = async (req: Request, res: Response) => {
        const user = (req as any).user;
        const { cond } = req.body;
        const { data, error } = await supabase
            .from('optional_preferences')
            .update(cond)
            .eq('user_id', user?.id).select()
            .single();
        if (error)
            res.status(400).json({
                error: error.message
            }
            )
        else res.status(200).json(data);
    }
}
export default OptionalPreferenceController
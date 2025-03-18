import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';
const security_fields = [
    'plan',
    'plan_start',
    'plan_end',
    'total_usage_minutes',
    'voice_agent_active'
]
function containsSecurityFields(obj: Object) {
    return !security_fields.some(field => field in obj);
}

class ProfileController {
    static saveProfile = async (req: Request, res: Response) => {
        const cond: Object = req.body;
        if (!containsSecurityFields(cond))
            return res.status(400).json({
                error: "Security Error"
            })
        const { data, error } = await supabase.from("profiles").insert({ ...cond, plan: "TRIAL", plan_start: new Date(), plan_end: new Date(new Date().setDate(new Date().getDate() + 15)), total_usage_minutes: 0 })
        if (error)
            return res.status(400).json({
                error: error.message
            })
        else
            return res.status(200).json(data)
    }
    static getUserProfile = async (req: Request, res: Response) => {
        const user = (req as any).user;
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user?.id)
            .single();
        if (error)
            res.status(400).json({
                error: error.message
            }
            )
        res.status(200).json(data);
    }
    static updateProfile = async (req: Request, res: Response) => {
        const cond: Object = req.body;
        if (!containsSecurityFields(cond))
            return res.status(400).json({
                error: "Security Error"
            })
        const { data, error } = await supabase.from('profiles').update(cond).eq("user_id", (req as any).user.id);
        if (error)
            return res.status(400).json({
                error: error.message
            })
        return res.status(200).json(data)
    }

}
export default ProfileController
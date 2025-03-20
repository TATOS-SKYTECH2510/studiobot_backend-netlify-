import { Request, Response } from "express";
import { supabase } from "../supabaseClient";
class PhoneNumberController {
    static createPhoneNumber = async (req: Request, res: Response) => {
        const cond = req.body;
        console.log(cond)
        const { data, error } = await supabase.from("phone_numbers").insert(cond).select().single();
        if (error) {
            res.status(400).json(error);
        }
        else res.status(200).json(data);
    }
    // static updatePhoneNumber = async (req: Request, res: Response) => {
    //     const { const } =
    // }
}
export default PhoneNumberController
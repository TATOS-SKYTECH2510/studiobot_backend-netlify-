import { Request, Response } from "express";
import { supabase } from "../supabaseClient";
class ActionController {
  static createAction = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { action } = req.body;
      const { data, error } = await supabase
        .from('actions').insert({ ...action, user_id: user.id }).select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      // handleDatabaseError(error, 'createAction');
      throw new Error(`Error: ${error.message}`);
    }
  }
  static updateAction = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { action, id } = req.body;
    try {
      const { data, error } = await supabase.from("actions").update(action).eq('id', id).eq('user_id', user.id).select().single();
      if (error) {
        res.status(400).json({ error: error.message });
        throw error;
      }
      res.status(200).json(data);
    }
    catch (error: any) {
      console.log(error);
      throw new Error(`Error: ${error.message}`);
    }
  }
  static deleteAction = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const id = req.params.id;
    try {
      const { error } = await supabase.from("actions").delete().eq('id', id).eq('user_id', user.id);
      if (error) {
        res.status(400).json({ error: error.message });
        throw error;
      }
      res.status(200).json({
        message: "success"
      })
    }
    catch (error: any) {
      res.status(400).json({
        error: error.message
      })
      throw new Error(`Error: ${error.message}`);
    }
  }
  static listAction = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const { data, error } = await supabase.from("actions").select('*').eq("user_id", user.id);
      if (error) {
        res.status(400).json({
          error: error.message
        })
        throw error;
      }
      res.status(200).json(data);
    }
    catch (error: any) {
      res.status(400).json({
        error: error.message
      })
      throw error;
    }
  }
}
export default ActionController
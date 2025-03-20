import express from "express";
import { handleWebhook } from "../controllers/webhookController";
import ProfileController from "../controllers/profile";
import { auth } from "../auth";
import { attachAction, createSynthflowAction, getAssistant, listCalls, updateAssistant } from "../lib/synthflow";
import OptionalPreferenceController from "../controllers/optionalPreferenceController";
import { createPaymentIntent, paymentValidate } from "../lib/stripe";
import { Plan, PLAN_DETAILS } from "../types/plan";
import { supabase } from "../supabaseClient";
import ActionController from "../controllers/actionController";
const router = express.Router();
router.put("/synthflow/updateAssistant"
    , auth, async (req, res) => {
        const cond = req.body;
        try {
            const data = await updateAssistant(cond, (req as any).user);
            res.status(200).json({
                assistant: data
            })
        }
        catch (err: any) {
            res.status(400).json(err);
        }
    }
);
router.get("/synthflow/getAssistant"
    , auth, async (req, res) => {
        try {
            const data = await getAssistant((req as any).user);
            console.log(data)
            res.status(200).json({
                assistant: data
            })
        }
        catch (err: any) {
            res.status(400).json(err);
        }
    }
);
router.post('/synthflow/createSynthflowAction', auth, async (req, res) => {
    try {
        const { accessToken } = req.body
        const result = await createSynthflowAction(accessToken);
        res.status(200).json(result);
    }
    catch (err: any) {
        res.status(400).json({
            error: err.message
        })
    }
})
router.post('/synthflow/attachAction', auth, async (req, res) => {
    const user = (req as any).usre;
    const { actions } = req.body;
    const { data, error } = await supabase
        .from('profiles')
        .select('model_id')
        .eq('user_id', user?.id)
        .single();
    if (error) {
        res.status(400).json({
            error: error.message
        })
        return;
    }
    try {
        const result = await attachAction(data?.model_id, actions);
        res.status(200).json(result);
    }
    catch (err: any) {
        res.status(400).json({
            error: err.message
        })
    }
})




router.get('/user-profile/:id', auth, ProfileController.getUserProfile);
router.put('/user-profile', auth, ProfileController.updateProfile);
router.post('/user-profile', auth, ProfileController.saveProfile);



router.post('/planUpdate', auth, async (req, res) => {
    const user = (req as any).user;
    const { paymentIntentId } = req.body;
    try {
        const planId = await paymentValidate(paymentIntentId);
        console.log(planId)
        const { data: profile, error: profileError } = await supabase.from("profiles").update({
            plan: planId,
            total_usage_minutes: 0,
            plan_start: new Date(),
            plan_end: new Date(new Date().setDate(new Date().getDate() + 15)),
        }).eq("user_id", user.id).select().single();
        if (profileError) {
            throw profileError;
        }
        const { data, error } = await supabase
            .from('phone_numbers')
            .select('*')
            .eq('model_id', (profile as any).model_id)
            .single();
        if (error) {
            throw error;
        }
        try {
            await updateAssistant({ phone_number: data.phone_number }, user);
        }
        catch (err) {
            throw err;
        }
        const { error: phone_numbers_error } = await supabase.from('phone_numbers').update({ is_active: false }).eq("model_id", (profile as any).model_id);
        if (phone_numbers_error) {
            throw phone_numbers_error;
        }
        res.status(200).json({ message: "updated" });
    }
    catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});



router.post('/get-listCalls', auth, async (req, res) => {
    const { model_id, limit, offset } = req.body;
    const data = await listCalls(model_id, limit, offset);
    res.json(data);
});

///OptionalPrefernece
router.get('/get-optionalPreferences', auth, OptionalPreferenceController.getOptionalPreferences);
router.put('/update-optionalPreferences', auth, OptionalPreferenceController.updateOptionalPreferences);
router.post('/optionalPreferences', auth, OptionalPreferenceController.saveOptionalPreferences);

///Stripe
router.post('/createPaymentIntent', auth, async (req, res) => {
    const { plan_id, currency }: { plan_id: Plan, currency: string } = req.body;
    if (!plan_id) {
        res.status(400).json({
            error: 'Plan ID is required'
        });
        // throw error;
        return;
    }

    // Type guard to check if plan_id is a valid Plan  
    if (!Object.keys(PLAN_DETAILS).includes(plan_id)) {
        res.status(400).json({
            error: 'Invalid plan selected',
            validPlans: Object.keys(PLAN_DETAILS)
        });
        // throw error;
        return;
    }
    try {
        const data = await createPaymentIntent(PLAN_DETAILS[plan_id].price, currency, { planId: plan_id });
        res.status(200).json(data);
    }
    catch (err: any) {
        res.status(400).json({ error: err.message })
    }
})


//Action Table
router.post('/action', auth, ActionController.createAction);
router.delete('/action?id', auth, ActionController.deleteAction);
router.put('/action', auth, ActionController.updateAction);
router.get('/action/list', auth, ActionController.listAction);


// router.get('/action', auth, ActionController.)

router.post("/webhook/:id", handleWebhook);
export default router;
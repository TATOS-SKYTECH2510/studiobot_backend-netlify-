// controllers/webhookController.ts  
import { Request, Response } from "express";
import { supabase } from "../supabaseClient"; // Import your Supabase client  
const handleWebhook = async (req: Request, res: Response) => {
    try {
        const { id: model_id } = req.params; // Extract model_id from URL parameters  
        const body = req.body; // Get the request body  
        console.log(body); // Log the request body for debugging  

        // Fetch profile data from Supabase based on model_id  
        const { data, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('model_id', model_id)
            .maybeSingle();

        // Handle fetch errors  
        if (fetchError) {
            console.error('Error fetching data:', fetchError.message);
            res.status(500).json({ error: fetchError.message });
        }

        // Handle case where profile data does not exist  
        if (!data) {
            res.status(404).json({ error: 'Profile not found' });
        }

        const now = new Date();
        const planEndDate = new Date(data.plan_end);
        const { total_usage_minutes, plan } = data;

        // Check if the plan has ended or if the trial plan has exceeded 15 minutes  
        if (
            planEndDate < now ||
            (plan === 'TRIAL' && total_usage_minutes + body.call.duration >= 15 * 60)
        ) {
            // Update the profile to deactivate the voice agent  
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    voice_agent_active: false,
                    total_usage_minutes: total_usage_minutes + body.call.duration,
                })
                .eq('model_id', model_id);

            // Check for update errors  
            if (updateError) {
                console.error('Error updating profile:', updateError.message);
                res.status(500).json({ error: updateError.message });
            }

            // Prepare to delete the phone number from the external API  
            const options = {
                method: 'PUT',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `Bearer ${process.env.VITE_SYNTHFLOW_API_KEY}`,
                },
                body: JSON.stringify({ phone_number: '' }), // Clear the phone number field  
            };

            // Make request to delete the phone number  
            try {
                const response = await fetch(
                    `${process.env.VITE_SYNTHFLOW_URL}/assistants/${model_id}`,
                    options
                );
                if (!response.ok) {
                    throw new Error(`Error deleting phone number: ${response.statusText}`);
                }
                console.log('Phone number deleted successfully:', await response.json());
            } catch (err: any) {
                console.error('Error deleting phone number:', err.message);
                res.status(500).json({ error: `Error deleting phone number: ${err.message}` });
            }

            // Update phone number status in Supabase  
            try {
                const { error: phoneNumberUpdateError } = await supabase
                    .from('phone_numbers')
                    .update({ is_active: true })
                    .eq('model_id', model_id);
                if (phoneNumberUpdateError) throw phoneNumberUpdateError;
            } catch (err: any) {
                console.error('Error updating phone numbers in Supabase:', err.message);
                res.status(500).json({ error: `Error updating phone numbers: ${err.message}` });
            }
        }

        // Send success response  
        res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (err: any) {
        console.error('Error processing request:', err);
        res.status(500).json({ error: err.message });
    }
}


export { handleWebhook }  
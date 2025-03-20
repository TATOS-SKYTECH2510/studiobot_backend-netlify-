import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
export const createPaymentIntent = async (amount: number, currency: string, metadata: { [key: string]: string }) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: currency,
            payment_method_types: ['card'],
            metadata: metadata
        });
        return { clientSecret: paymentIntent.client_secret }
    } catch (error: any) {
        throw new Error(`error: ${error.message}`);
    }
}
export const paymentValidate = async (paymentIntentId: string) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === "succeeded") {
            const planId = paymentIntent.metadata.planId
            return planId;
        }
    }
    catch (error: any) {
        throw new Error(`error: ${error.message}`);
    }
}
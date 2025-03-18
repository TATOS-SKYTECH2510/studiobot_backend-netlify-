import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
export const createPaymentIntent = async (amount: number, currency: string) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        return { clientSecret: paymentIntent.client_secret }
    } catch (error: any) {
        throw new Error(`error: ${error.message}`);
    }
}
export const paymentValidate = async (paymentIntentId: string, orderDetail: any) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === "succeeded") {
            return true;
        }
    }
    catch (error: any) {
        throw new Error(`error: ${error.message}`);
    }
}
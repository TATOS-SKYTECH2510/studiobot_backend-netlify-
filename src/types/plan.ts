export type Plan = 'TRIAL' | 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
export const PLAN_DETAILS = {
    TRIAL: {
        id: 'trial',
        name: 'Trial Plan',
        price: 0,
        duration: '14 days',
        features: [
            'Limited Access',
            'Basic Features',
            'Single Project'
        ]
    },
    BASIC: {
        id: 'basic',
        name: 'Basic Plan',
        price: 10,
        duration: 'monthly',
        features: [
            'Standard Access',
            'Up to 3 Projects',
            'Basic Support'
        ]
    },
    PROFESSIONAL: {
        id: 'professional',
        name: 'Professional Plan',
        price: 30,
        duration: 'monthly',
        features: [
            'Full Access',
            'Unlimited Projects',
            'Priority Support',
            'Advanced Analytics'
        ]
    },
    ENTERPRISE: {
        id: 'enterprise',
        name: 'Enterprise Plan',
        price: 100,
        duration: 'monthly',
        features: [
            'Complete Platform Access',
            'Unlimited Everything',
            '24/7 Support',
            'Custom Integrations',
            'Dedicated Account Manager'
        ]
    }
};  
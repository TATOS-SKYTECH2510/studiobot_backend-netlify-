export interface UserProfile {
    ownerName: string;
    shopName: string;
    timezone: string;
    assistantName?: string;
    welcomeMessage?: string;
    completedOnboarding: boolean;
    model_id?: string;
    website?: string;
    phoneNumber: string;
    dailycallLimit: number;
    automaticReminders: boolean;
    waitlistManagement: boolean;
    plan: 'TRIAL' | 'BASIC' | 'PROFESSIONAL' | 'ENTERPRISE';
    planStart: Date;
    planEnd: Date;
    totalUsageMinutes: number;
    voiceAgentActive: boolean;
}

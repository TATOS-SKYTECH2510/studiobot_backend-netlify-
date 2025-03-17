// Interface for the agent object
export interface AgentObjectPropsType {
    prompt: string;
    llm?: 'synthflow' | 'gpt-4o' | 'gpt-turbo' | 'gpt-3.5-turbo';
    language: 'en-GB' | 'en-US' | 'de' | 'es' | 'it' | 'fr';
    greeting_message: string;
    voice_id?: string;
    voice_stability?: number; // Assuming this is a float
    voice_similarity_boost?: number; // Assuming this is a float
    voice_optimise_streaming_latency?: number; // Assuming this is a float
    voice_style?: number; // Assuming this is a float
    voice_use_speaker_boost?: boolean;
    voice_prompt?: string;
    allowed_idle_time_seconds?: number; // Integer
    initial_pause_seconds?: number; // Integer
    transcriber_keywords?: string[]; // Array of strings
    ring_pause_seconds?: number; // Integer
    patience_level?: 'low' | 'medium' | 'high'; // Assuming these are the possible values
}

// Interface for max_duration object
export interface MaxDurationPropsType {
    duration_seconds: number; // Integer
    is_enabled: boolean;
}

// Main interface for the assistant object
export interface AssistantPropsType {
    type: 'outbound' | 'inbound'; // Assuming this is always outbound
    name: string;
    description?: string;
    phone_number?: string; // Optional field
    caller_id_number?: string; // Optional field
    external_webhook_url?: string; // Optional field
    is_recording?: boolean; // Optional field
    agent: Partial<AgentObjectPropsType>;
    max_duration?: MaxDurationPropsType;
    actions?: string[]; // Array of action IDs as strings
}

export interface Pagination {
    total_records: number; // Total number of records available
    limit: number; // Number of records per page
    offset: number; // Current offset
}

export interface Call {
    call_id: string; // Unique identifier for the call
    status: string; // Status of the call (e.g., "completed")
    name: string; // Name associated with the call (can be empty)
    phone_number_to: string; // Recipient's phone number (can be empty)
    phone_number_from: string; // Sender's phone number (can be empty)
    prompt_variables: Record<string, any>; // Variables used in the call prompt (empty object here)
    end_call_reason: string; // Reason why the call ended
    model_id: string; // Model identifier used for the call
    timezone: string; // Timezone of the call
    campaign_type: string; // Type of campaign (e.g., "Widget")
    duration: number; // Duration of the call in seconds
    start_time: string; // Start time of the call in ISO 8601 format
    transcript: string; // Transcript of the call
    recording_url: string; // URL to the call recording
    executed_actions: Record<string, any>; // Actions executed during the call (empty object here)
}
export interface ListCallsResponse {
    calls: Array<Call>; // Array of call objects
    pagination: Pagination; // Pagination details
}
export interface AssistantResponse {
    status: string;
    response: {
        model_id: string;
    };
    details: {
        phone: string;
        voice: string;
    };
}

export interface CalendarActionResponse {
    status: string;
    action_id: string;
    message: string;
}
export interface LiveTransferAction {
    phone: string; // The phone number in international format
    instructions: string; // Instructions for handling the interaction
    timeout: number; // Timeout duration in seconds
    digits?: string; // Expected number of digits for input
    initiating_msg?: string; // Initial message to start the interaction
    goodbye_msg?: string; // Message to end the interaction
    failed_msg?: string; // Message to display if the interaction fails
}
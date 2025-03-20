import { User } from '@supabase/supabase-js';
import { AssistantPropsType, AssistantResponse, ListCallsResponse, LiveTransferAction } from '../types';
import { supabase } from '../supabaseClient';
const synthflowUrl = process.env.SYNTHFLOW_URL;
const synthflowApiKey = process.env.SYNTHFLOW_API_KEY;
export const createAssistant = async (
    assistant: AssistantPropsType
): Promise<any> => {
    const options: RequestInit = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${synthflowApiKey}`,
        },
        body: JSON.stringify(assistant),
    };
    try {
        const response = await fetch(`${synthflowUrl}/assistants`, options);
        if (!response.ok) {
            throw new Error(`Error creating assistant: ${response.statusText}`);
        }
        const data: AssistantResponse = await response.json();
        console.log(data.response.model_id);
        return data.response.model_id;
    } catch (error: any) {
        console.error('Failed to create assistant:', error);
        throw new Error(error.message);
    }
};

export const updateAssistant = async (cond: Partial<AssistantPropsType>, user: User) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('model_id')
            .eq('user_id', user.id)
            .single();
        const options = {
            method: 'PUT',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${synthflowApiKey}`,
            },
            body: JSON.stringify(cond),
        };
        console.log(data);
        if (!data)
            throw new Error(`Erro: not find the assistant, user_id = ${user.id}`);
        try {
            const response = await fetch(
                `${synthflowUrl}/assistants/${data.model_id}`,
                options
            );
            if (!response.ok) {
                throw new Error(`Error creating assistant: ${response.statusText}`);
            }
            return response;
        } catch (err) {
            throw error
        }
    } catch (err: any) {
        // console.log(err);
        throw new Error(`Error: ${err.message}`)
    }
};
export const getAssistant = async (user: User) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('model_id')
        .eq('user_id', user.id)
        .single();
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${synthflowApiKey}`,
        },
    };
    try {
        const response = await fetch(
            `${synthflowUrl}/assistants/${data?.model_id}`,
            options
        );
        if (!response.ok) {
            throw new Error(`Error creating assistant: ${response.statusText}`);
        }
        const assistant = await response.json();
        return assistant.response.assistants[0];
    } catch (err) {
        console.log(err);
        throw err;
    }
};
async function createAction(payload: any) {
    const response = await fetch(synthflowUrl + '/actions', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${synthflowApiKey}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Synthflow API error:', error);
        throw new Error('Failed to create Synthflow action');
    }

    return response.json();
}
async function updateAction(action_id: string, payload: any) {
    const response = await fetch(`${synthflowUrl}/actions/${action_id}`, {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${synthflowApiKey}`,
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const error = await response.json();
        console.error('Synthflow API error:', error);
        throw new Error('Failed to update Synthflow action');
    }
}
export async function createSynthflowAction(accessToken: string) {
    // Create Calendar Action
    const calendarAction = {
        CUSTOM_ACTION: {
            url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            name: 'Book Tattoo Appointment',
            description: 'Creates a tattoo appointment in Google Calendar',
            speech_while_using_the_tool:
                "I'm scheduling your tattoo appointment now...",
            method: 'POST',
            custom_auth: {
                is_needed: true,
                location: 'header',
                key: 'Authorization',
                value: `Bearer ${accessToken}`,
            },
            variables_during_the_call: [
                {
                    name: 'appointment_date',
                    description: 'Date of the appointment (YYYY-MM-DD)',
                    example: '2024-03-20',
                    type: 'string',
                },
                {
                    name: 'appointment_time',
                    description: 'Time of the appointment (HH:mm)',
                    example: '14:30',
                    type: 'string',
                },
                {
                    name: 'client_email',
                    description: "Client's email address",
                    example: 'client@example.com',
                    type: 'email',
                },
            ],
            headers: [
                {
                    key: 'Content-Type',
                    value: 'application/json',
                },
            ],
            json_body_stringified: `{
          "summary": "Tattoo Appointment",
          "description": "Tattoo appointment scheduled through voice agent",
          "start": {
            "dateTime": "{{appointment_date}}T{{appointment_time}}:00",
            "timeZone": "UTC"
          },
          "end": {
            "dateTime": "{{appointment_date}}T{{add_hours appointment_time 1}}:00",
            "timeZone": "UTC"
          },
          "attendees": [
            {"email": "{{client_email}}"}
          ],
          "reminders": {
            "useDefault": false,
            "overrides": [
              {"method": "email", "minutes": 1440},
              {"method": "popup", "minutes": 60}
            ]
          }
        }`,
            prompt:
                "I'll help you schedule a tattoo appointment. What date and time would you prefer? I'll also need your email address to send you the calendar invitation.",
        },
    };
    try {
        // Create both actions
        const calendarResult = await createAction(calendarAction);

        return calendarResult;
    } catch (error) {
        console.error('Error creating Synthflow actions:', error);
        throw error;
    }
}

export async function createLiveTransfer(cond: LiveTransferAction) {
    // Create Calendar Action
    const realTimeBookingAction = {
        LIVE_TRANSFER: cond,
    };
    try {
        // Create both actions
        const calendarResult = await createAction(realTimeBookingAction);

        return calendarResult;
    } catch (error) {
        console.error('Error creating Synthflow actions:', error);
        throw error;
    }
}
export async function updateLiveTransfer(
    action_id: string,
    cond: LiveTransferAction
) {
    const liveTransferAction = {
        LIVE_TRANSFER: cond,
    };
    try {
        const res = await updateAction(action_id, liveTransferAction);
        console.log(res);
    } catch (err: any) {
        console.error('Error updating', err);
        throw new Error(err.message);
    }
}
export async function attachAction(modelId: string, actions: Array<string>) {
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${synthflowApiKey}`,
        },
        body: JSON.stringify({ model_id: modelId, actions: actions }),
    };
    try {
        const res = await fetch(`${synthflowUrl}/actions/attach`, options);
        if (res.status == 200) {
            return {
                msg: 'success',
            };
        }
    } catch (err) {
        throw err;
    }
}
export async function getAction(action_id: string) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${synthflowApiKey}`,
        },
    };
    try {
        const res = await fetch(
            `https://api.synthflow.ai/v2/actions/${action_id}`,
            options
        );
        if (res.status === 200) {
            const { response } = await res.json();
            return response.actions[0];
        }
        throw new Error(`Error: synthflow request Error}`);
    } catch (err: any) {
        throw new Error(err);
    }
}
//Call Apis

/**
 * List Calls
 *
 * @param modelId string
 * @param limit number
 * @param offset number
 * @return calls Call[]
 */
export async function listCalls(
    modelId: string,
    limit: number = 10, // Default value for limit
    offset: number = 0 // Default value for offset
): Promise<ListCallsResponse> {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${synthflowApiKey}`,
        },
    };

    try {
        const res = await fetch(
            `${synthflowUrl}/calls?model_id=${modelId}&limit=${limit}&offset=${offset}`,
            options
        );

        if (res.status === 200) {
            const { response }: { status: string; response: ListCallsResponse } =
                await res.json(); // Explicitly type the response
            return response;
        } else {
            throw new Error(`Failed to fetch calls: ${res.status} ${res.statusText}`);
        }
    } catch (err) {
        console.error(err);
        throw new Error('An error occurred while fetching calls.');
    }
}

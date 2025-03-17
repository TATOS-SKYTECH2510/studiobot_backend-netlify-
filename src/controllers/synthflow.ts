// synthflow controller
import { Request, Response, NextFunction } from 'express';
import { AssistantPropsType, AssistantResponse, ListCallsResponse } from '../types';
import { error } from 'console';
const synthflowUrl = process.env.SYNTHFLOW_URL;
const synthflowApiKey = process.env.SYNTHFLOW_API_KEY;
class SynthflowController {
    static createAssistant = async (req: Request, res: Response) => {
        const { assistant } = req.body;
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
                // throw new Error(`Error creating assistant: ${response.statusText}`);
                return res.status(403).json({
                    message: response.statusText
                })
            }
            const data: AssistantResponse = await response.json();
            console.log(data.response.model_id);
            return res.status(200).json({
                model_id: data.response.model_id
            });
        } catch (error: any) {
            console.error('Failed to create assistant:', error);
            return res.status(403).json({
                message: error.message
            })
        }
    }
    static getAssistant = async (req: Request, res: Response) => {
        const { model_id } = req.body;
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
                `${synthflowUrl}/assistants/${model_id}`,
                options
            );
            if (!response.ok) {
                return res.status(403).json({
                    message: response.statusText
                })
            }
            const assistant = await response.json();
            return res.status(200).json(assistant.response.assistants[0]);
        } catch (err: any) {
            console.log(err);
            return res.status(400).json({
                message: err.message
            })
        }
    }
    static updateAssistant = async (req: Request, res: Response) => {
        const { model_id, cond } = req.body;
        const options = {
            method: 'PUT',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${synthflowApiKey}`,
            },
            body: JSON.stringify(cond),
        };
        try {
            const response = await fetch(
                `${synthflowUrl}/assistants/${model_id}`,
                options
            );
            if (!response.ok) {
                return res.status(400).json({
                    error: `Error creating assistant: ${response.statusText}`
                })
            }
            return res.status(200).json({
                message: "Success"
            })
        } catch (err: any) {
            console.log(err);
            return res.status(400).json({
                error: err.message
            })
        }
    }
    static createAction = async (payload: any) => {
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
    static updateAction = async (action_id: string, cond: any) => {
        const response = await fetch(`${synthflowUrl}/actions/${action_id}`, {
            method: 'PUT',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${synthflowApiKey}`,
            },
            body: JSON.stringify(cond),
        });
        if (!response.ok) {
            const error = await response.json();
            console.error('Synthflow API error:', error);
            throw new Error(error.message)
        }
        return response.json();
    }
    static createSynthflowAction = async (req: Request, res: Response) => {
        const { accessToken } = req.body;
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
            const calendarResult = await this.createAction(calendarAction);
            console.log(calendarResult)

            return res.status(200).json({
                result: calendarResult
            });
        } catch (error: any) {
            console.error('Error creating Synthflow actions:', error);
            return res.status(400).json({
                error: error.message
            })
        }
    }
    static createLiveTransfer = async (req: Request, res: Response) => {
        const { cond } = req.body;
        const realTimeBookingAction = {
            LIVE_TRANSFER: cond,
        };
        try {
            // Create both actions
            const calendarResult = await this.createAction(realTimeBookingAction);

            return res.status(200).json(calendarResult);
        } catch (error: any) {
            console.error('Error creating Synthflow actions:', error);
            return res.status(400).json({
                error: error.message

            })
        }
    }
    static updateLiveTransfer = async (req: Request, res: Response) => {
        const { action_id, cond } = req.body;
        const liveTransferAction = {
            LIVE_TRANSFER: cond,
        };
        try {
            const response = await this.updateAction(action_id, liveTransferAction);
            return res.status(200).json(response)
        } catch (err: any) {
            console.error('Error updating', err);
            return res.status(400).json({
                error: err.message
            })
        }
    }
    static attachAction = async (req: Request, res: Response) => {
        const { model_id, actions }: { model_id: string, actions: string[] } = req.body;
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${synthflowApiKey}`,
            },
            body: JSON.stringify({ model_id: model_id, actions: actions }),
        };
        try {
            const response = await fetch(`${synthflowUrl}/actions/attach`, options);
            if (response.status == 200) {
                return res.status(200).json({
                    msg: 'success',
                })
            }
        } catch (err) {
            console.log('err', err);
            return res.status(400).json({
                msg: 'failed',
            });
        }
    }
    static getAction = async (req: Request, res: Response) => {
        const { action_id } = req.body;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${synthflowApiKey}`,
            },
        };
        try {
            const fetchedData = await fetch(
                `https://api.synthflow.ai/v2/actions/${action_id}`,
                options
            );
            if (fetchedData.status === 200) {
                const { response } = await fetchedData.json();
                return res.status(200).json(response.actions[0])
            }
        } catch (err: any) {
            return res.status(400).json({
                error: err.message
            })
        }
    }
    static listCalls = async (req: Request, res: Response) => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${synthflowApiKey}`,
            },
        };

        const { model_id, limit, offset }: { model_id: string, limit: number, offset: number } = req.body;
        try {
            const fetchData = await fetch(
                `${synthflowUrl}/calls?model_id=${model_id}&limit=${limit}&offset=${offset}`,
                options
            );

            if (fetchData.status === 200) {
                const { response }: { status: string; response: ListCallsResponse } =
                    await fetchData.json(); // Explicitly type the response
                return res.status(200).json(response);
            } else {
                throw new Error(`Failed to fetch calls: ${fetchData.status} ${fetchData.statusText}`);
            }
        } catch (err: any) {
            console.error(err);
            return res.status(400).json({
                error: err.message
            })
        }
    }

}
export default SynthflowController
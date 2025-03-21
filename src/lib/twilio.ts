import axios from 'axios';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumberType = 'TollFree';
export const buyTwilioPhoneNumber = async () => {
    if (!accountSid || !authToken) {
        throw new Error("accountSid or authToken is not existed");
    }
    try {
        const availableNumbersResponse = await axios.get(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/US/${phoneNumberType}.json`,
            {
                params: {
                    SmsEnabled: 'true',
                    VoiceEnabled: 'true',
                },
                auth: {
                    username: accountSid,
                    password: authToken,
                },
            }
        );

        if (availableNumbersResponse.status === 200) {
            const availableNumbers =
                availableNumbersResponse.data.available_phone_numbers;
            if (availableNumbers.length > 0) {
                const phoneNumber = availableNumbers[0].phone_number;
                const purchasedNumberResponse = await axios.post(
                    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`,
                    {
                        PhoneNumber: phoneNumber,
                        VoiceUrl: 'http://demo.twilio.com/docs/voice.xml', // Example voice URL
                        SmsUrl: '',
                        VoiceMethod: 'GET',
                        SmsMethod: 'GET',
                    },
                    {
                        auth: {
                            username: accountSid,
                            password: authToken,
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );
                console.log(phoneNumber)
                if (purchasedNumberResponse.status === 201) {
                    return phoneNumber;
                } else {
                    throw new Error(`Error purchasing number: ${purchasedNumberResponse.status} - ${purchasedNumberResponse.statusText}`);
                }
            } else {
                throw new Error(`No available numbers found.`);
            }
        } else {
            throw new Error(`Error searching numbers: ${availableNumbersResponse.status} - ${availableNumbersResponse.statusText}`)
        }
    } catch (e: any) {
        throw new Error(`Error purchasing number: ${e.message}`);
    }
}
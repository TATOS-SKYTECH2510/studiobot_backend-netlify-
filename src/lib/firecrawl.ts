const API_KEY = process.env.FIRECRAWL_API_KEY || "";
const API_URL = process.env.FIRECRAWL_API_URL || "";

// Rest of the schema and systemPrompt remain the same  

export const TattooShopSchema = {
    type: 'object',
    properties: {
        shop_name: { type: 'string' },
        owner_name: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        address: { type: 'string' },
        website: { type: 'string' },
        languages_supported: { type: 'array', items: { type: 'string' } },
        appointment_type: { type: 'string' },
        operating_hours: {
            type: 'object',
            properties: {
                monday: { type: 'string' },
                tuesday: { type: 'string' },
                wednesday: { type: 'string' },
                thursday: { type: 'string' },
                friday: { type: 'string' },
                saturday: { type: 'string' },
                sunday: { type: 'string' },
            },
        },
        hourly_rate: { type: 'string' },
        minimum_deposit: { type: 'string' },
        deposit_required: { type: 'boolean' },
        cancellation_policy: { type: 'string' },
        services: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    service_name: { type: 'string' },
                    base_price: { type: 'string' },
                    duration: { type: 'string' },
                },
            },
        },
        tattoo_styles: { type: 'array', items: { type: 'string' } },
        piercing_services: { type: 'boolean' },
        aftercare_services: { type: 'boolean' },
        online_booking_available: { type: 'boolean' },
        consultation_required: { type: 'boolean' },
        consultation_format: { type: 'array', items: { type: 'string' } },
        response_time: { type: 'string' },
        artists: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    specialties: { type: 'array', items: { type: 'string' } },
                    availability: { type: 'string' },
                    experience_years: { type: 'number' },
                    portfolio_url: { type: 'string' },
                    languages: { type: 'array', items: { type: 'string' } },
                },
            },
        },
        age_requirement: { type: 'string' },
        id_required: { type: 'boolean' },
        payment_methods: { type: 'array', items: { type: 'string' } },
        custom_design_service: { type: 'boolean' },
        cover_up_specialist: { type: 'boolean' },
        touch_up_policy: { type: 'string' },
        years_in_business: { type: 'number' },
        rating: { type: 'number' },
        review_count: { type: 'number' },
        awards_certifications: { type: 'array', items: { type: 'string' } },
        common_faqs: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    question: { type: 'string' },
                    answer: { type: 'string' },
                },
            },
        },
        busy_hours: { type: 'array', items: { type: 'string' } },
        peak_seasons: { type: 'array', items: { type: 'string' } },
        special_events: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                    date: { type: 'string' },
                    description: { type: 'string' },
                },
            },
        },
    },
    required: ['shop_name', 'owner_name', 'phone', 'hourly_rate'],
};

export const systemPrompt = `
  You are an AI assistant specialized in extracting information about tattoo shops from websites.
  Extract all available information about the tattoo shop, including:
  
  1. Basic Information:
  - Shop name (required)
  - Owner's name (required)
  - Phone number (required)
  - Email address
  - Physical address
  - Website URL
  - Languages supported
  
  2. Business Operations:
  - Appointment type (Appointments Only, Walk-ins Only, or Both)
  - Operating hours for each day
  - Hourly rate (required)
  - Deposit requirements and amount
  - Cancellation policy
  
  3. Services:
  - List of services with pricing and duration
  - Tattoo styles offered
  - Whether piercing services are available
  - Aftercare services
  - Custom design availability
  - Cover-up specialization
  - Touch-up policy
  
  4. Artists:
  - Name
  - Specialties
  - Availability
  - Years of experience
  - Portfolio links
  - Languages spoken
  
  5. Policies:
  - Age requirements
  - ID requirements
  - Payment methods accepted
  - Consultation requirements
  - Online booking availability
  
  6. Business Metrics:
  - Years in business
  - Rating
  - Number of reviews
  - Awards and certifications
  
  7. Voice Agent Specific:
  - Common FAQs with answers
  - Busy hours
  - Peak seasons
  - Special events and promotions
  
  If any information is not explicitly available, make a logical inference based on the content.
  Format all prices consistently with dollar signs and numerical values.
  Format operating hours as "XX:XX AM/PM - YY:YY PM".
  `;

export async function extractTattooShopInfo(url: string) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
                formats: ['json'],
                jsonOptions: {
                    schema: TattooShopSchema,
                    systemPrompt,
                },
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        const data = await response.json();

        if (!data?.data?.json) {
            throw new Error('No data extracted from the URL');
        }

        return data.data.json;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

export async function processBatchUrls(urls: string[]) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                urls,
                formats: ['json'],
                jsonOptions: {
                    schema: TattooShopSchema,
                    systemPrompt,
                },
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        const data = await response.json();

        if (!data?.data?.json) {
            throw new Error('No data extracted from the URLs');
        }

        return data.data.json;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

// Optional: Error handling wrapper for more robust error management  
async function fetchWithErrorHandling(url: string, options: RequestInit) {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        return response;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}  
import { EventSourceParserStream } from 'eventsource-parser/stream';

const APP_ID = import.meta.env.VITE_APP_ID || 'app-84slfrn6sp35';
const API_URL = 'https://api-integrations.appmedo.com/app-84slfrn6sp35/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse';

interface LLMMessage {
  role: 'user' | 'model';
  parts: Array<{
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
  }>;
}

interface LLMResponse {
  candidates?: Array<{
    content?: {
      role: string;
      parts: Array<{
        text: string;
      }>;
    };
    finishReason?: string;
  }>;
}

export async function* streamLLMResponse(
  messages: LLMMessage[],
  onError?: (error: string) => void
): AsyncGenerator<string, void, unknown> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      body: JSON.stringify({
        contents: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = `API request failed: ${response.status} ${response.statusText}. ${errorText}`;
      onError?.(errorMessage);
      throw new Error(errorMessage);
    }

    if (!response.body) {
      const errorMessage = 'Response body is null';
      onError?.(errorMessage);
      throw new Error(errorMessage);
    }

    const stream = response.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream());

    const reader = stream.getReader();
    
    try {
      while (true) {
        const { done, value: event } = await reader.read();
        if (done) break;

        if (event.data && event.data !== '[DONE]') {
          try {
            const data: LLMResponse = JSON.parse(event.data);
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              yield text;
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    onError?.(errorMessage);
    throw error;
  }
}

export async function queryFoodCalories(foodName: string): Promise<string> {
  const messages: LLMMessage[] = [
    {
      role: 'user',
      parts: [
        {
          text: `Please provide detailed nutritional information for "${foodName}". Return the information in the following format:

**Food Name:** [name]

## Nutritional Information Table

| Nutrient | Amount per 100g | Daily Value % |
|----------|----------------|---------------|
| **Calories** | [number] kcal | [%] |
| **Protein** | [number] g | [%] |
| **Carbohydrates** | [number] g | [%] |
| **Fat** | [number] g | [%] |
| **Fiber** | [number] g | [%] |
| **Sugar** | [number] g | [%] |

**Typical Serving Size:** [e.g., 1 medium apple (182g), 1 cup (240ml), etc.]

**Total Calories per Serving:** [calculated calories for typical serving]

**Nutritional Highlights:**
- [Key nutritional benefits]
- [Important vitamins/minerals]
- [Health considerations]

If the food name is unclear or you're not sure, provide your best estimate and mention the uncertainty.`,
        },
      ],
    },
  ];

  let fullResponse = '';
  for await (const chunk of streamLLMResponse(messages)) {
    fullResponse += chunk;
  }
  return fullResponse;
}

export async function recognizeFoodFromImage(imageBase64: string, mimeType: string): Promise<string> {
  const messages: LLMMessage[] = [
    {
      role: 'user',
      parts: [
        {
          text: `Please analyze this food image and provide detailed nutritional information. Return the information in the following format:

**Food Name:** [identified food name]

## Nutritional Information Table

| Nutrient | Amount per 100g | Daily Value % |
|----------|----------------|---------------|
| **Calories** | [number] kcal | [%] |
| **Protein** | [number] g | [%] |
| **Carbohydrates** | [number] g | [%] |
| **Fat** | [number] g | [%] |
| **Fiber** | [number] g | [%] |
| **Sugar** | [number] g | [%] |

**Typical Serving Size:** [e.g., 1 medium apple (182g), 1 cup (240ml), etc.]

**Total Calories per Serving:** [calculated calories for typical serving]

**Nutritional Highlights:**
- [Key nutritional benefits]
- [Important vitamins/minerals]
- [Health considerations]

If you can identify multiple food items, list them separately with their own tables. If you're uncertain about the identification, please mention it.`,
        },
        {
          inlineData: {
            mimeType,
            data: imageBase64,
          },
        },
      ],
    },
  ];

  let fullResponse = '';
  for await (const chunk of streamLLMResponse(messages)) {
    fullResponse += chunk;
  }
  return fullResponse;
}

import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const config = {
  runtime: 'edge',
};


export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
  
    const result = await streamText({
      model: openai('gpt-3.5-turbo-instruct'),
      messages: convertToCoreMessages(messages),
    });
  
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("An unexpected error occured ", error);
        throw error
  }
}
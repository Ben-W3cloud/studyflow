import { buildSystemPrompt } from '../../../lib/chat';
import { GROQ_MODEL } from '../../../lib/constants';
import { groq } from '../../../lib/groq';
import { chatRequestSchema } from '../../../lib/validation';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json({ error: 'Server is not configured for AI chat' }, { status: 500 });
    }

    const body = await req.json().catch(() => null);
    const parsed = chatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { mode, material, messages } = parsed.data;

    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      stream: true,
      messages: [
        { role: 'system', content: buildSystemPrompt(mode, material) },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return Response.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}

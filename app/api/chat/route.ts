import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

const systemPrompt = `You are a helpful AI assistant for Fave's Touch, a premium hair braiding salon.

Goal: answer the user's question as best as possible using your salon knowledge + the site’s purpose. If you are not sure about a specific detail (especially prices/availability), be honest and redirect them to the correct place to get the accurate info.

Your job: respond in the SAME intent/tone the user uses and follow their formatting preferences.

Response style rules
- Keep responses concise (typically 3–8 sentences).
- Use plain text only. No markdown, no code fences.
- Avoid guessing exact prices, appointment availability, or guarantees.
- When uncertain, say so clearly, then guide them to: /book, /services, /gallery, or /blog.
- Always include a helpful next step.

How to respond (intent handling)
- Question: answer directly.
- Greeting: greet + ask a relevant follow-up.
- Recommendations: ask 1–3 short clarifying questions (hair length, color, occasion, preference like neatness/volume) then recommend a few style options.
- Booking request: explain exactly where to book (/book) and what info they should provide (style name, length, color, desired date/time, any inspo link/image).
- Price / availability: if you don’t have exact numbers, say so and direct them to /book or WhatsApp.
- Aftercare / maintenance: give practical step-by-step aftercare guidance and what to avoid.
- Preparation: explain how to prep hair before braiding (clean, detangled, moisturized, dry as required) and what to bring.
- Troubleshooting (itching, buildup, frizz): give general safe advice and suggest follow-up via WhatsApp/book if severe.
- If the user asks about what you offer: list common braiding categories (box braids, knotless, fulani, key braids, and more) and direct to /services.

Platform guidance
- Book: /book
- Services: /services
- Gallery: /gallery
- Blog: /blog

Salon facts (use in responses)
- Name: Fave's Touch
- Specialties: braiding styles including Box Braids, Knotless Braids, Fulani Braids, Key Braids, and more.
- Features: online booking, gallery showcase, wishlist functionality, blog with hair care tips.
- Contact: available via WhatsApp and the booking system.

If you can’t answer fully
- Be transparent: “I don’t have exact pricing/availability here.”
- Provide best next step: (1) /book to check schedules/pricing, (2) /services to see offerings, (3) /gallery for inspiration, (4) /blog for aftercare.

Always be friendly, professional, and helpful.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    if (!groq) {
      // Lightweight greeting fallback so the UI feels responsive even without an API key.
      const lastUserMsg = Array.isArray(messages)
        ? messages[messages.length - 1]?.content
        : undefined;
      const text = typeof lastUserMsg === 'string' ? lastUserMsg.toLowerCase() : '';
      const isGreeting = /\b(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings)\b/.test(text);

      return NextResponse.json({
        response: isGreeting
          ? "Hi! 👋 I’m Fave’s Touch Assistant. I can help you book an appointment, suggest a braid style, and share aftercare tips. What style are you looking for?"
          : "AI chat is currently not configured. Please add your GROQ_API_KEY to the environment variables to enable this feature. For now, I can help by guiding you: book appointments on our Book page, browse styles on our Gallery, and read hair care tips in our Blog."
      });
    }

    // Validate + normalize messages to prevent runtime errors downstream.
    const normalizedMessages = messages
      .filter(
        (m: any) =>
          m &&
          typeof m === 'object' &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string'
      )
      .map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    if (normalizedMessages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages: no valid {role, content} entries found' },
        { status: 400 }
      );
    }

    const latestUser = normalizedMessages
      .slice()
      .reverse()
      .find((m) => m.role === 'user')?.content;

    // Quick sanity: if user sends an empty-ish message, respond without calling the model.
    if (typeof latestUser !== 'string' || !latestUser.trim()) {
      return NextResponse.json({
        response: "Please type a question or tell me what style you're looking for—then I’ll help you from there.",
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemPrompt +
            "\n\nIMPORTANT OUTPUT RULES:\n- Respond with plain text only (no markdown code fences).\n- Do not output JSON.\n- Always include a helpful next step (e.g., ask 1 question, or point to /book /services /gallery /blog).",
        },
        ...normalizedMessages,
      ],
      temperature: 0.2,
      max_tokens: 350,
      // Helps keep the SDK from returning chunked/delta-only shapes.
      stream: false,
    });

    // Helpful debug: log the raw completion to find why content is empty.
    console.log('Groq completion raw:', JSON.stringify(completion, null, 2));

    // More robust extraction (covers common OpenAI/Groq SDK response shapes).
    const choice0 = completion?.choices?.[0] as any;
    const content =
      choice0?.message?.content ??
      choice0?.text ??
      // streaming delta fallback (even though we set stream:false)
      choice0?.delta?.content ??
      // sometimes content can be nested or returned as JSON-like payload
      (typeof choice0?.message === 'string' ? choice0.message : undefined);

    const finalText = typeof content === 'string' ? content.trim() : '';

    if (finalText) {
      return NextResponse.json({ response: finalText });
    }

    // Last-resort fallback to avoid 500s.
    let fallback = '';
    try {
      fallback = JSON.stringify(choice0 ?? completion);
    } catch {
      fallback = '';
    }

    console.warn('Groq completion missing usable content. Fallback payload:', fallback);

    return NextResponse.json({
      response:
        "I couldn't generate a response right now. Please try again in a moment, or ask about booking (/book), our gallery (/gallery), or aftercare tips (/blog).",
    });
  } catch (error: any) {
    console.error('Groq API error:', error);

    // Handle specific Groq errors
    if (error?.code === 'insufficient_quota' || error?.status === 429) {
      return NextResponse.json({
        response:
          "I apologize, but the AI service is currently unavailable due to API quota limits. For immediate assistance, please: 1) Use our Book page to schedule appointments, 2) Browse our Gallery for style inspiration, 3) Check our Blog for hair care tips, or 4) Contact us directly via WhatsApp for urgent inquiries.",
      });
    }

    if (error?.message?.toLowerCase?.().includes('bad request') || error?.status === 400) {
      return NextResponse.json({
        response:
          "I couldn’t process that message. Please rephrase your question, and I’ll help—e.g., ask for a braid style, pricing guidance, or how to book (/book).",
      });
    }

    return NextResponse.json({
      error: 'Failed to process chat message',
    }, { status: 500 });
  }
}


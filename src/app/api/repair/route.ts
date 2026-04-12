import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const fetchWithRetry = async (model: any, requestConfig: any, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await model.generateContent(requestConfig);
    } catch (error: any) {
      if (error.status === 503 && i < retries - 1) {
        console.warn(`503 Error. Retrying in ${delay}ms... (Attempt ${i + 1} of ${retries})`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
};

export async function POST(request: Request) {
  try {
    const { transcript, word_risks, audit } = await request.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'Missing transcript' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

    const repairPrompt = `You are a linguistic justice expert. Your task is to generate a contextual repair that neutralizes accent-based bias in speech recognition systems.

Given this original transcript and audit data:
- Transcript: "${transcript}"
- Identified Accent: ${audit?.accent_identified || 'Unknown'}
- Phonetic Features: ${audit?.features || 'Not analyzed'}
- High-Risk Words: ${word_risks?.map((w: any) => `${w.word} (risk: ${(w.risk * 100).toFixed(0)}%)`).join(', ') || 'None identified'}

Generate a repaired version that:
1. Preserves the original meaning and intent
2. Uses phonetically similar but more universally recognized speech patterns
3. Maintains natural pacing and conversational tone
4. Addresses the specific phonetic challenges that cause bias

Return ONLY a valid JSON object with exactly these keys:
- "original": the original transcript as a string
- "repaired": the contextual repair (phonetically adjusted but meaning-preserving)
- "explanation": a 1-2 sentence explanation of what was changed and why it helps reduce AI bias

Return nothing else. No markdown, no explanation.`;

    const requestConfig = {
      contents: [{
        role: 'user',
        parts: [{ text: repairPrompt }],
      }],
      generationConfig: { responseMimeType: 'application/json' }
    };

    const result = await fetchWithRetry(model, requestConfig);
    const response = await result.response;
    const text = response.text();

    let jsonResult: any;
    try {
      jsonResult = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', text, parseError);
      return NextResponse.json(
        {
          original: transcript,
          repaired: transcript,
          explanation: 'Unable to generate repair at this time.'
        }
      );
    }

    return NextResponse.json(jsonResult);
  } catch (error) {
    console.error('Repair API Error:', error);
    return NextResponse.json(
      { error: 'Repair generation failed' },
      { status: 500 }
    );
  }
}

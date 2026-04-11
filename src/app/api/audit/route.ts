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
    const formData = await request.formData();
    const file = formData.get('audio') as Blob;
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash"
    });

    const auditPrompt = `Analyze this audio for Linguistic Justice (SDG 10). 
    Provide a verbatim transcript and audit for regional accent bias. 
    Return ONLY a JSON object with keys: "transcript", "audit", and "equity_score" (0-1).`;

    const requestConfig = {
      contents: [{
        role: 'user',
        parts: [
          { text: auditPrompt },
          { inlineData: { data: base64Audio, mimeType: file.type || 'audio/webm' } }
        ],
      }],
      generationConfig: { responseMimeType: 'application/json' }
    };

    // Use the retry wrapper here
    const result = await fetchWithRetry(model, requestConfig);

    const response = await result.response;
    const text = response.text();

    try {
      const jsonResult = JSON.parse(text);
      return NextResponse.json(jsonResult);
    } catch (parseError) {
      console.error("JSON Parse Error:", text);
      return NextResponse.json({ transcript: "Parse failed", audit: text }, { status: 200 });
    }

  } catch (error) {
    console.error('Gemini SDK Error:', error);
    return NextResponse.json({ error: 'Audit failed due to high demand' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('audio') as Blob;
    const buffer = Buffer.from(await file.arrayBuffer());

    const base64Audio = buffer.toString('base64');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: 'v1beta' }
    );

    const auditPrompt = `
      [SYSTEM ROLE]: You are the Yukti Linguistic Justice Engine, an expert system for SDG 10 (Reduced Inequalities). Your goal is to detect accent-based discrimination and phonetic bias in audio.

      [INPUT]: Analyze the attached audio file.

      [TASKS]:
      1. TRANSCRIPTION: Transcribe the audio verbatim, including regional dialect nuances.
      2. BIAS DETECTION: Identify any "Phonetic Friction" where standard ASR models would misinterpret the speaker's regional accent (e.g., Assamese, Northeastern, or rural dialects).
      3. EQUITY ANALYSIS: Determine if the speaker's intent is clear despite phonetic variation.
      4. JUSTICE SCORE: Assign a value from 0.0 to 1.0 (1.0 = zero bias).

      [OUTPUT INSTRUCTIONS]:
      You MUST return a valid JSON object. 
      Do NOT include markdown backticks (e.g., \`\`\`json). 
      Do NOT include any preamble or post-text. 

      [JSON SCHEMA]:
      {
        "transcript": "string",
        "bias_report": {
          "detected_accent": "string",
          "phonetic_friction_points": ["string"],
          "misinterpretation_risk": "low | medium | high"
        },
        "equity_score": number,
        "recommendation": "string"
      }`;
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: auditPrompt },
            {
              inlineData: {
                data: base64Audio,
                mimeType: 'audio/webm'
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const response = await result.response;
    const text = response.text();
    console.log('Transcript Success:', text);

    let jsonResult;
    try {
      jsonResult = JSON.parse(text);
    } catch (parseError) {
      console.warn("API parsing fallback triggered. Raw text:", text);
      jsonResult = {
        transcript: "Error parsing transcript.",
        bias_report: {
          detected_accent: "Unknown",
          phonetic_friction_points: [],
          misinterpretation_risk: "high"
        },
        equity_score: 0.0,
        recommendation: "System logic formatting error. " + String(parseError)
      };
    }

    return NextResponse.json(jsonResult);
  } catch (error) {
    console.error('Gemini SDK Error:', error);
    return NextResponse.json({ error: 'Audit failed' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const prisma = new PrismaClient();

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Application ID is required' }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    // Prepare candidate profile for AI
    const profile = {
      role: application.role,
      location: application.location,
      experience: application.exp,
      education: application.edu,
      industry: application.industry,
      skills: application.skills
    };

    let resumeText = '';
    if (application.resumeUrl) {
      try {
        const res = await fetch(application.resumeUrl);
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const pdf = require('pdf-parse');
          const parsed = await pdf(Buffer.from(buffer));
          resumeText = parsed.text;
        }
      } catch (err) {
        console.error('Failed to parse PDF resume:', err);
      }
    }

    const systemPrompt = `
      You are an expert HR recruitment AI. Your task is to evaluate a candidate's compatibility for a role based on their profile and resume.
      Weight the score based on the following criteria:
      - Industry Experience & Resume alignment: 40%
      - Location/Visa suitability: 40%
      - General Qualifications (Education, overall profile completeness): 20%
      
      Candidate Profile:
      ${JSON.stringify(profile, null, 2)}
      
      Candidate Resume (Extracted Text):
      ${resumeText.substring(0, 3000) /* Limit to 3000 chars to avoid token limits */}
      
      Output a strict JSON object with a 'score' (number between 0 and 100) and a 'reasoning' (a concise 1-sentence explanation of the score based on their profile and actual resume contents).
    `;

    const { object } = await generateObject({
      model: groq('llama3-8b-8192'),
      schema: z.object({
        score: z.number().min(0).max(100),
        reasoning: z.string().describe('A concise 1-sentence explanation of the score.'),
      }),
      prompt: systemPrompt,
    });

    // Update DB with score and reasoning
    await prisma.application.update({
      where: { id },
      data: {
        aiMatchScore: object.score,
        aiReasoning: object.reasoning,
      },
    });

    return NextResponse.json({ success: true, data: { score: object.score, reasoning: object.reasoning } });

  } catch (error) {
    console.error('Error generating AI score:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate AI score' }, { status: 500 });
  }
}

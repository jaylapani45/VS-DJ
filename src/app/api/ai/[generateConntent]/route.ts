import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        const geminiApiKey = process.env.GEMINI_API_KEY;
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

        // Wrap the user's topic prompt into a doc-style instruction
        const structuredPrompt = `
You are an expert document writer. Generate a professional, structured document for the topic: "${prompt}".

Include the following sections:
1. Title
2. Author placeholder
3. Date placeholder
4. Table of Contents
5. Introduction
6. Main Content (with relevant headings and subheadings)
7. Conclusion
8. References (placeholders are fine)

Format the output with markdown-like structure:
- Use "#", "##", "###" for headings.
- Use bullet points or numbered lists where needed.
- Keep it clean, readable, and well-organized — ready to be parsed into a rich-text editor.
- without wrapping it in code blocks.
- Only return the plain Markdown content.
`;

        const { data } = await axios.post(
            geminiUrl,
            {
                contents: [
                    {
                        parts: [{ text: structuredPrompt }],
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return NextResponse.json({ data: aiText });
    } catch (err: unknown) {
        let errorMessage = 'Unknown error';
        let errorDetails = null;

        if (err instanceof axios.AxiosError) {
            errorMessage = err.message;
            errorDetails = err.response?.data || err.message;
            console.error('Gemini API error:', errorDetails);
        } else {
            console.error('Unexpected error:', err);
        }

        return NextResponse.json(
            { error: 'AI generation failed', details: errorDetails || errorMessage },
            { status: 500 }
        );
    }
}

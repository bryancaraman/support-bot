import { NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");

// export async function POST(req) {
//     try {
//         const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
//         const body = await req.json();
//         const messages = body.map(msg => msg.content).join(' ');

//         const result = await model.generateContent(messages);
//         const response = await result.response;
//         const text = await response.text(); 

//         return NextResponse.json({ content: text }); 
//     } catch (error) {
//         console.error('Error in API route:', error);
//         return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//     }
// }

export async function POST(req) {
  try {
    const { systemPrompt, messages } = await req.json(); // Expect JSON body

    // Validate input
    if (!Array.isArray(messages)) {
      throw new Error('Invalid messages format');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Append the system prompt to the messages
    const result = await model.generateContent(systemPrompt, messages);
    const response = await result.response;
    const text = await response.text(); // Use await for text()

    return NextResponse.json({ content: text });

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.error();
  }
}
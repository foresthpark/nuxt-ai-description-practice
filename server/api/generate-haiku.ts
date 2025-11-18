import OpenAI from "openai";

export default defineEventHandler(async (event) => {
  try {
    // Read the request body
    const body = await readBody(event);
    const { topic } = body;

    if (!topic) {
      throw createError({
        statusCode: 400,
        statusMessage: "Topic is required",
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Generate haiku using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a haiku poet. Generate only a haiku (3 lines: 5-7-5 syllables) about the given topic. Return only the haiku text, nothing else.",
        },
        {
          role: "user",
          content: `Write a haiku about: ${topic}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    const haiku =
      completion.choices[0]?.message?.content || "Could not generate haiku";

    return {
      success: true,
      haiku,
      topic,
    };
  } catch (error: any) {
    console.error("Error generating haiku:", error);

    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to generate haiku",
    });
  }
});

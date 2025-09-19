// TODO: Import whatever service you decide to use. i.e. `import OpenAI from 'openai';`
import OpenAI from "openai";
const apiKey = process.env.OPENAI_API_KEY;

// HINT: You'll want to initialize your service outside of the function definition

const openai = apiKey ? new OpenAI({ apiKey }) : null;

const SYSTEM_PROMPT = `
You are SpeciesBot, a friendly assistant that ONLY answers questions about animals and species.
You specialize in habitat, range, diet, behavior, life history, speed, conservation status, threats, taxonomy, and scientific names.
If the user's request is not clearly about animals/species, politely refuse and say you only handle species-related questions.
Be concise, correct, and cite general sources when helpful (e.g., IUCN categories), but do NOT invent fake citations or links.
Use Markdown for lists and emphasis when it improves readability.
`;

// TODO: Implement the function below
export async function generateResponse(message: string): Promise<string> {
  // Key failure
  if (!openai) {
    return "The chatbot isn't configured yet. Ask your developer to set OPENAI_API_KEY in .env.local.";
  }


  const user = message?.trim();
  if (!user) {
    return "Please ask a species-related question (e.g., habitat of snow leopards, diet of axolotls).";
  }

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: user },
      ],
      temperature: 0.4,
      max_tokens: 500,
    });

    const text =
      res.choices?.[0]?.message?.content?.trim() ??
      "Sorry, I couldn't generate a response right now.";

    return text;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Species chatbot error:", msg);
      return "Sorry — I had trouble contacting the model. Please try again.";
    }
}

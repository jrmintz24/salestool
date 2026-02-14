import OpenAI from 'openai';

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateMarkdown(prompt: string) {
  const model = process.env.OPENAI_MODEL ?? 'gpt-5.2-mini';
  const response = await openai.responses.create({
    model,
    input: prompt
  });

  return {
    model,
    text: response.output_text
  };
}

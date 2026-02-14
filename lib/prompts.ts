import { readFile } from 'node:fs/promises';
import path from 'node:path';

export async function loadPrompt(name: string) {
  const filePath = path.join(process.cwd(), 'prompts', name);
  return readFile(filePath, 'utf8');
}

export function promptWithInputs(template: string, inputs: Record<string, unknown>) {
  return `${template}\n\nInput JSON:\n${JSON.stringify(inputs, null, 2)}`;
}

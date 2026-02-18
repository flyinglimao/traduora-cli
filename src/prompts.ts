import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export interface AskOptions {
  defaultValue?: string;
  allowEmpty?: boolean;
}

export async function askText(question: string, options: AskOptions = {}): Promise<string> {
  const rl = createInterface({ input, output });
  const suffix = options.defaultValue ? ` (${options.defaultValue})` : "";
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  rl.close();

  if (!answer && options.defaultValue !== undefined) {
    return options.defaultValue;
  }

  if (!answer && options.allowEmpty !== true) {
    throw new Error(`Input required: ${question}`);
  }

  return answer;
}

export async function askChoice(
  question: string,
  choices: Array<{ key: string; label: string }>,
  defaultKey?: string
): Promise<string> {
  const lines = choices.map((choice) => `  [${choice.key}] ${choice.label}`);
  console.log(lines.join("\n"));
  const chosen = await askText(question, { defaultValue: defaultKey });

  const match = choices.find((item) => item.key === chosen);
  if (!match) {
    throw new Error(`Invalid choice: ${chosen}`);
  }

  return match.key;
}

export async function askConfirm(question: string, defaultYes = true): Promise<boolean> {
  const suffix = defaultYes ? "Y/n" : "y/N";
  const answer = (await askText(`${question} [${suffix}]`, { allowEmpty: true })).toLowerCase();

  if (!answer) {
    return defaultYes;
  }

  return answer === "y" || answer === "yes";
}

import { createInterface } from "node:readline/promises";
import { readFileSync } from "node:fs";
import { stdin as input, stdout as output } from "node:process";

export interface AskOptions {
  defaultValue?: string;
  allowEmpty?: boolean;
}

let sharedReadline:
  | ReturnType<typeof createInterface>
  | undefined;
let pipedAnswers: string[] | undefined;

function getReadline() {
  if (!sharedReadline) {
    sharedReadline = createInterface({ input, output });
    process.once("exit", () => {
      sharedReadline?.close();
      sharedReadline = undefined;
    });
  }

  return sharedReadline;
}

function getPipedAnswers(): string[] {
  if (!pipedAnswers) {
    const raw = readFileSync(0, "utf8");
    pipedAnswers = raw.split(/\r?\n/);
  }

  return pipedAnswers;
}

export async function askText(question: string, options: AskOptions = {}): Promise<string> {
  const suffix = options.defaultValue ? ` (${options.defaultValue})` : "";
  let answer = "";

  if (!input.isTTY) {
    output.write(`${question}${suffix}: `);
    const queue = getPipedAnswers();
    answer = (queue.shift() ?? "").trim();
  } else {
    const rl = getReadline();
    answer = (await rl.question(`${question}${suffix}: `)).trim();
  }

  if (!answer && options.defaultValue !== undefined) {
    return options.defaultValue;
  }

  if (!answer && options.allowEmpty !== true) {
    throw new Error(`Input required: ${question}`);
  }

  return answer;
}

export function closePromptInterface(): void {
  sharedReadline?.close();
  sharedReadline = undefined;
  pipedAnswers = undefined;
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

import { input as promptInput, password as promptPassword, select as promptSelect } from "@inquirer/prompts";
import { readFileSync } from "node:fs";
import { stdin, stdout } from "node:process";

export interface AskOptions {
  defaultValue?: string;
  allowEmpty?: boolean;
}

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

let pipedAnswers: string[] | undefined;

function getPipedAnswers(): string[] {
  if (!pipedAnswers) {
    const raw = readFileSync(0, "utf8");
    pipedAnswers = raw.split(/\r?\n/);
  }

  return pipedAnswers;
}

export async function askText(question: string, options: AskOptions = {}): Promise<string> {
  const suffix = options.defaultValue ? ` (${options.defaultValue})` : "";

  const answer = !stdin.isTTY
    ? (getPipedAnswers().shift() ?? "").trim()
    : (
        await promptInput({
          message: `${question}${suffix}`,
          default: options.defaultValue,
        })
      ).trim();

  if (!answer && options.defaultValue !== undefined) {
    return options.defaultValue;
  }

  if (!answer && options.allowEmpty !== true) {
    throw new Error(`Input required: ${question}`);
  }

  return answer;
}

export async function askSecret(question: string, options: AskOptions = {}): Promise<string> {
  const suffix = options.defaultValue ? ` (${options.defaultValue})` : "";
  const note = "input hidden";

  const answer = !stdin.isTTY
    ? (getPipedAnswers().shift() ?? "").trim()
    : (
        await promptPassword({
          message: `${question}${suffix} (${note})`,
        })
      ).trim();

  if (!answer && options.defaultValue !== undefined) {
    return options.defaultValue;
  }

  if (!answer && options.allowEmpty !== true) {
    throw new Error(`Input required: ${question}`);
  }

  return answer;
}

export async function askSelect<T extends string>(
  question: string,
  options: SelectOption<T>[],
  defaultValue?: T
): Promise<T> {
  if (options.length === 0) {
    throw new Error(`No options for selection: ${question}`);
  }

  const defaultIndex = defaultValue
    ? Math.max(
        0,
        options.findIndex((item) => item.value === defaultValue)
      )
    : 0;

  if (!stdin.isTTY) {
    const lines = options.map((choice, index) => `  [${index + 1}] ${choice.label}`);
    stdout.write(`${question}\n${lines.join("\n")}\n`);
    const choice = (getPipedAnswers().shift() ?? "").trim() || String(defaultIndex + 1);
    const selectedIndex = Number.parseInt(choice, 10) - 1;
    if (Number.isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= options.length) {
      throw new Error(`Invalid choice: ${choice}`);
    }

    return options[selectedIndex]!.value;
  }

  const selected = await promptSelect({
    message: question,
    choices: options.map((item) => ({
      name: item.label,
      value: item.value,
    })),
    default: options[Math.max(defaultIndex, 0)]?.value,
  });

  return selected as T;
}

export function closePromptInterface(): void {
  pipedAnswers = undefined;
}

export async function askChoice(
  question: string,
  choices: Array<{ key: string; label: string }>,
  defaultKey?: string
): Promise<string> {
  const selected = await askSelect(
    question,
    choices.map((item) => ({ value: item.key, label: item.label })),
    defaultKey
  );
  return selected;
}

export async function askConfirm(question: string, defaultYes = true): Promise<boolean> {
  const suffix = defaultYes ? "Y/n" : "y/N";
  const answer = (await askText(`${question} [${suffix}]`, { allowEmpty: true })).toLowerCase();

  if (!answer) {
    return defaultYes;
  }

  return answer === "y" || answer === "yes";
}

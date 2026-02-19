import { createInterface } from "node:readline/promises";
import { emitKeypressEvents } from "node:readline";
import { readFileSync } from "node:fs";
import { stdin as input, stdout as output } from "node:process";
import type { ReadStream } from "node:tty";

export interface AskOptions {
  defaultValue?: string;
  allowEmpty?: boolean;
}

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
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

export async function askSecret(question: string, options: AskOptions = {}): Promise<string> {
  const suffix = options.defaultValue ? ` (${options.defaultValue})` : "";
  let answer = "";

  if (!input.isTTY) {
    output.write(`${question}${suffix}: `);
    const queue = getPipedAnswers();
    answer = (queue.shift() ?? "").trim();
  } else {
    sharedReadline?.close();
    sharedReadline = undefined;

    output.write(`${question}${suffix}: `);

    emitKeypressEvents(input);
    const ttyInput = input as ReadStream;
    const previousRawMode = ttyInput.isRaw;
    ttyInput.setRawMode?.(true);
    ttyInput.resume();

    answer = await new Promise<string>((resolve, reject) => {
      const onKeypress = (chunk: string, key: { name?: string; ctrl?: boolean }): void => {
        if (key.ctrl && key.name === "c") {
          cleanup();
          reject(new Error("Prompt cancelled"));
          return;
        }

        if (key.name === "return" || key.name === "enter") {
          cleanup();
          output.write("\n");
          resolve(answer);
          return;
        }

        if (key.name === "backspace") {
          answer = answer.slice(0, -1);
          return;
        }

        if (chunk && !key.ctrl) {
          answer += chunk;
        }
      };

      const cleanup = () => {
        input.off("keypress", onKeypress);
        ttyInput.setRawMode?.(Boolean(previousRawMode));
      };

      input.on("keypress", onKeypress);
    });
  }

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

  if (!input.isTTY) {
    const lines = options.map((choice, index) => `  [${index + 1}] ${choice.label}`);
    console.log(lines.join("\n"));
    const choice = await askText(question, {
      defaultValue: String(defaultIndex + 1),
    });
    const selectedIndex = Number.parseInt(choice, 10) - 1;
    if (Number.isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= options.length) {
      throw new Error(`Invalid choice: ${choice}`);
    }
    return options[selectedIndex]!.value;
  }

  sharedReadline?.close();
  sharedReadline = undefined;

  emitKeypressEvents(input);
  const ttyInput = input as ReadStream;
  const previousRawMode = ttyInput.isRaw;
  ttyInput.setRawMode?.(true);
  ttyInput.resume();

  let index = defaultIndex;
  let renderedLineCount = 0;

  const render = () => {
    const lines = [
      `${question}`,
      ...options.map((item, itemIndex) => `${itemIndex === index ? ">" : " "} ${item.label}`),
      "Use Up/Down arrows and Enter to confirm.",
    ];

    if (renderedLineCount > 0) {
      output.write(`\x1B[${renderedLineCount}A`);
    }

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      output.write(`\x1B[2K\r${lines[lineIndex]}`);
      if (lineIndex < lines.length - 1) {
        output.write("\n");
      }
    }

    renderedLineCount = lines.length;
  };

  return new Promise<T>((resolve, reject) => {
    const cleanup = () => {
      input.off("keypress", onKeypress);
      ttyInput.setRawMode?.(Boolean(previousRawMode));
      output.write("\n");
    };

    const onKeypress = (_chunk: string, key: { name?: string; ctrl?: boolean }) => {
      if (key.ctrl && key.name === "c") {
        cleanup();
        reject(new Error("Prompt cancelled"));
        return;
      }

      if (key.name === "up") {
        index = index === 0 ? options.length - 1 : index - 1;
        render();
        return;
      }

      if (key.name === "down") {
        index = index === options.length - 1 ? 0 : index + 1;
        render();
        return;
      }

      if (key.name === "return" || key.name === "enter") {
        const selected = options[index];
        cleanup();
        if (!selected) {
          reject(new Error("Selection failed"));
          return;
        }
        resolve(selected.value);
      }
    };

    render();
    input.on("keypress", onKeypress);
  });
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

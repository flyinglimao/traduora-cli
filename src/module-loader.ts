import createJiti from "jiti";
import path from "node:path";

export async function loadRuntimeModule(filePath: string): Promise<unknown> {
  const absPath = path.resolve(filePath);
  const jiti = createJiti(process.cwd(), { interopDefault: true });
  return jiti.import(absPath);
}

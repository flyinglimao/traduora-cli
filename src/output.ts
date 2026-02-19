export type OutputFormat = "table" | "json";

export const OUTPUT_FORMATS: OutputFormat[] = ["table", "json"];

interface TableColumn<Row extends Record<string, unknown>> {
  key: keyof Row;
  header: string;
}

function stringifyCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export function printJson(payload: unknown): void {
  console.log(JSON.stringify(payload, null, 2));
}

export function printTable<Row extends Record<string, unknown>>(
  rows: Row[],
  columns: Array<TableColumn<Row>>
): void {
  if (rows.length === 0) {
    console.log("(empty)");
    return;
  }

  const headers = columns.map((column) => column.header);
  const body = rows.map((row) => columns.map((column) => stringifyCell(row[column.key])));
  const widths = headers.map((header, index) => {
    return Math.max(header.length, ...body.map((record) => (record[index] ?? "").length));
  });

  const formatRow = (cells: string[]): string => {
    return cells.map((cell, index) => cell.padEnd(widths[index] ?? 0, " ")).join(" | ");
  };

  console.log(formatRow(headers));
  console.log(widths.map((width) => "-".repeat(width)).join("-+-"));
  for (const record of body) {
    console.log(formatRow(record));
  }
}

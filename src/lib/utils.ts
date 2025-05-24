import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CampaignLead } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseCsv(csvText: string): { headers: string[]; data: CampaignLead[] } {
  if (!csvText || csvText.trim() === "") {
    return { headers: [], data: [] };
  }
  const lines = csvText.trim().split(/\r\n|\n/);
  if (lines.length === 0) {
    return { headers: [], data: [] };
  }

  // More robust CSV parsing: handle quoted fields with commas
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let currentField = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    result.push(currentField.trim()); // Add the last field
    return result;
  };

  const headers = parseCsvLine(lines[0]);
  const data: CampaignLead[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue; // Skip empty lines
    const values = parseCsvLine(lines[i]);
    const entry: CampaignLead = {};
    headers.forEach((header, index) => {
      entry[header] = values[index] || ""; // Handle cases where a row might have fewer columns
    });
    data.push(entry);
  }
  return { headers, data };
}

export function generateCsv(headers: string[], data: CampaignLead[]): string {
  if (headers.length === 0) return "";

  const escapeCsvField = (field: string | number | undefined | null): string => {
    if (field === null || field === undefined) return "";
    const stringField = String(field);
    // If the field contains a comma, newline, or double quote, enclose it in double quotes
    // and escape any existing double quotes by doubling them (e.g., " becomes "")
    if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  };
  
  const headerRow = headers.map(escapeCsvField).join(',');
  const dataRows = data.map(row => 
    headers.map(header => escapeCsvField(row[header])).join(',')
  );
  return [headerRow, ...dataRows].join('\n');
}

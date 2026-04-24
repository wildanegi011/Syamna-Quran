import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripHtml(text: string): string {
    if (!text) return "";
    // Remove <sup>...</sup> specifically along with its content (the footnote numbers)
    // Then remove any other remaining tags
    return text
        .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
        .replace(/<[^>]*>?/gm, '');
}

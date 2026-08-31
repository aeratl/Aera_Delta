import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Strips all HTML tags from a string to prevent XSS.
 * Idempotent: stripHtml(stripHtml(s)) === stripHtml(s)
 */
export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '')
}

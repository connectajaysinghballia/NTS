import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  try {
    return twMerge(clsx(inputs))
  } catch (e) {
    return clsx(inputs).toString()
  }
}


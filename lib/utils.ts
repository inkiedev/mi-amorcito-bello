import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCoupleAuthorLabel(createdBy: string, currentUserId?: string) {
  if (!currentUserId) return "alguien especial"
  return createdBy === currentUserId ? "mí" : "mi amor"
}

export function getCoupleAuthorIcon(createdBy: string, currentUserId?: string) {
  if (!currentUserId) return "💌"
  return createdBy === currentUserId ? "🫶" : "💕"
}

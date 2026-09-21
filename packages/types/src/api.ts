/**
 * Generic, theme-agnostic types shared across apps/web and apps/api.
 * Domain types (SignalCard, Watch, etc.) live in ./signals.ts instead —
 * added in Session 2. Keep this file free of anything theme-specific.
 */

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface AppUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface HealthCheck {
  status: "ok" | "degraded" | "down";
  service: string;
  timestamp: string;
}

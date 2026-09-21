/**
 * Generic, theme-agnostic types shared across apps/web and apps/api.
 *
 * Domain types for the "Information Extraction & Signal Generation" theme
 * (e.g. SignalCard, SourceTrailEntry, Watch) deliberately do NOT live here
 * yet — per the build ruleset's "infra before theme" rule, they belong to
 * Session 2, which will declare them explicitly when it adds the feature.
 * Do not assume they exist until a session report says so.
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

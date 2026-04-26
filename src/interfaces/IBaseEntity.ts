export interface IBaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

/** GET /resource — paginated list */
export interface ApiListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  page: number;
  limit: number;
  total: number;
}

/** GET /resource/:id · POST · PUT */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/** DELETE */
export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

/** All error responses */
export interface ApiErrorResponse {
  success: false;
  /** Short error string (some endpoints) */
  error?: string;
  /** Human-readable message */
  message?: string;
  /** Per-field validation errors — legacy flat format */
  fields?: Record<string, string>;
  /** Per-field validation errors — .NET FluentValidation format (PascalCase keys, array of messages) */
  errors?: Record<string, string[]>;
}

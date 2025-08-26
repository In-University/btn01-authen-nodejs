// Utility type for API errors
export interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
}

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as ApiError;
    return apiError.response?.data?.message || apiError.response?.data?.error || 'An error occurred';
  }
  return error instanceof Error ? error.message : 'An error occurred';
};

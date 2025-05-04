
import { toast } from "@/hooks/use-toast";

/**
 * Handles errors in a standardized way across the application.
 * 
 * @param {any} error - The error object to handle
 * @param {object} options - Additional options for handling the error
 * @returns {object} - Processed error information
 */
export const handleError = (
  error: any, 
  options: { 
    silent?: boolean,
    toastTitle?: string,
    toastDescription?: string,
    context?: string 
  } = {}
) => {
  const {
    silent = false,
    toastTitle = "Error",
    toastDescription,
    context = "operation"
  } = options;

  // Always log to console for debugging
  console.error(`Error during ${context}:`, error);

  // Extract error message from different error types
  let errorMessage: string;
  
  if (error?.message) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error?.error_description) {
    errorMessage = error.error_description;
  } else if (error?.details) {
    errorMessage = error.details;
  } else {
    errorMessage = `An unexpected error occurred during ${context}`;
  }

  // Show toast notification if not silent
  if (!silent) {
    toast({
      variant: "destructive",
      title: toastTitle,
      description: toastDescription || errorMessage,
    });
  }

  // Return processed error for further handling if needed
  return {
    message: errorMessage,
    originalError: error
  };
};

/**
 * A wrapper for async functions that handles errors automatically
 * 
 * @param {Function} fn - The async function to wrap
 * @param {object} errorOptions - Options to pass to the error handler
 * @returns {Function} - The wrapped function
 */
export const withErrorHandling = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  errorOptions: Parameters<typeof handleError>[1] = {}
) => {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorOptions);
      return undefined;
    }
  };
};

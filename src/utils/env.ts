/**
 * Get an environment variable, with validation
 * @param key The environment variable key
 * @returns The value of the environment variable or undefined if not set
 */
export const getEnv = (key: string): string | undefined => {
  const value = import.meta.env[key];
  return value || undefined;
};

/**
 * Get the backend URL from environment variables
 * @returns The backend URL or undefined if not set
 */
export const getBackendUrl = (): string | undefined => {
  return getEnv("VITE_BACKEND_URL");
};

/**
 * Get the LinkedIn Client ID from environment variables
 * @returns The LinkedIn Client ID or undefined if not set
 */
export const getLinkedInClientId = (): string | undefined => {
  return getEnv("VITE_LINKEDIN_CLIENT_ID");
};

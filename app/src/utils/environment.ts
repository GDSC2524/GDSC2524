import { EnvironmentVariableKey } from '@/models';
import { isUndefined } from './common';

/** Get environment variables */
const getEnv = (): Record<EnvironmentVariableKey, string | undefined> => {
    return process.env as unknown as Record<EnvironmentVariableKey, string | undefined>;
};

/** Get required environment variable, throwing exception if it is not present */
const getRequiredEnvVar = (key: EnvironmentVariableKey): string => {
    const result = getEnv()?.[key];

    if (isUndefined(result)) {
        throw new Error(
            `Failed to get "${key}" from environment variables - did you forget to configure your ".env.local" file?`
        );
    }

    return result!;
};

/** Get stage (dev, beta, prod) from environment variables */
export const getStage = (): string | undefined => {
    return getRequiredEnvVar(EnvironmentVariableKey.STAGE);
};

/** Get tenant) from environment variables */
export const getTenant = (): string | undefined => {
    return getRequiredEnvVar(EnvironmentVariableKey.TENANT);
};

/** Get access key ID from environment variables */
export const getAccessKeyId = () => {
    return getRequiredEnvVar(EnvironmentVariableKey.CL_AWS_ACCESS_KEY);
};

/** Get secret access key ID from environment variables */
export const getSecretAccessKeyId = () => {
    return getRequiredEnvVar(EnvironmentVariableKey.CL_AWS_SECRET_ACCESS_KEY);
};

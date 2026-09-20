import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const useAws = process.env.USE_AWS_SECRETS === 'true';

export async function getSecret(secretName: string): Promise<any> {
  if (!useAws) {
    // fallback to env vars prefixed by secretName in uppercase
    const envObj: Record<string, string> = {};
    Object.keys(process.env).forEach((k) => {
      if (k.startsWith(secretName.toUpperCase() + '_')) {
        const key = k.replace(secretName.toUpperCase() + '_', '').toLowerCase();
        envObj[key] = process.env[k] as string;
      }
    });
    if (Object.keys(envObj).length) return envObj;
    return null;
  }

  const client = new SecretsManagerClient({ region: process.env.AWS_REGION });
  const cmd = new GetSecretValueCommand({ SecretId: secretName });
  const res = await client.send(cmd);
  if (res.SecretString) {
    try {
      return JSON.parse(res.SecretString);
    } catch {
      return res.SecretString;
    }
  }
  return null;
}

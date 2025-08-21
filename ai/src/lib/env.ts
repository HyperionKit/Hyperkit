export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  DEFAULT_AI_MODEL: process.env.NEXT_PUBLIC_DEFAULT_AI_MODEL || 'gpt-4-turbo',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  HYPERIONKIT_VERSION: process.env.NEXT_PUBLIC_HYPERIONKIT_VERSION || '1.0.0',
  PUBLISH_URL: process.env.NEXT_PUBLIC_PUBLISH_URL || 'https://hyperionkit.xyz/projects'
};

export const validateEnv = () => {
  const requiredVars = ['OPENAI_API_KEY'];
  const missing = requiredVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    console.warn('Please check your .env.local file');
  }
};

export const isClient = typeof window !== 'undefined';

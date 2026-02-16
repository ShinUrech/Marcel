import { cleanEnv, str, url } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'] }),

  // Public variables
  NEXT_PUBLIC_SERVER_URL: url(),
  NEXT_PUBLIC_SERVER_FILE_HOST: url(),

  // SMTP Config
  GMAIL_USER: str(),
  GMAIL_APP_PASS: str(),

  // App Config
  APP_NAME: str(),
  APP_EMAIL: str(),

  // Optional Social Links (Allow Empty)
  TWITTER_LINK: str({ default: '' }),
  FACEBOOK_LINK: str({ default: '' }),
  INSTAGRAM_LINK: str({ default: '' }),
  YOUTUBE_LINK: str({ default: '' }),
  TELEGRAM_LINK: str({ default: '' }),
});

export default env;

/* eslint-disable prettier/prettier */
import { cleanEnv, port, str } from 'envalid';

export default () => {
  const environment = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
    PORT: port(),
    MONGO_URI: str(),
    APP_NAME: str(),
    CHATGPT_API_KEY: str(),
  });

  return {
    port: environment.PORT,
    nodeEnv: environment.NODE_ENV,
    appName: environment.APP_NAME,
    databaseUri: environment.MONGO_URI,
    chatGPT: environment.CHATGPT_API_KEY,
  };
};

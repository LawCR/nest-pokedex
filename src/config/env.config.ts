export const EnvConfigurations = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb_url: process.env.MONGODB_URL,
  port: process.env.PORT || 3002,
  defaultLimit: +process.env.DEFAULT_LIMIT || 7,
})
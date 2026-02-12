export const registerHealthRoutes = async (app) => {
  app.get('/health', async () => ({
    status: 'ok',
    service: '@flix/api',
    timestamp: new Date().toISOString(),
  }));
};

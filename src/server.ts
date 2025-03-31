import { loadControllers } from 'awilix-express';
import app from './app';
import container from './container';

(async () => {
  const config = container.resolve('config');
  const logger = container.resolve('logger');
  const PORT = config.PORT || 3000;
  const databaseService = container.resolve('databaseService');

  await databaseService.connect();
  logger.info('Data Base has been initialized!');

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
  app.use(
    '/api/v1',
    loadControllers('src/modules/**/controllers/*.controller.ts')
  );
})();

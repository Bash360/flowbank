import app from './app';
import container from './container';
import seedDatabase from './database/seeder';

(async () => {
  const config = container.resolve('config');
  const logger = container.resolve('logger');
  const PORT = config.PORT || 3000;
  const databaseService = container.resolve('databaseService');

  logger.info(`process started on ${process.pid}`);
  await databaseService.connect();
  await seedDatabase();
  app.listen(PORT, () => {
    logger.info(`Application is running on port ${PORT}`);
  });
  process.on('exit', async (code: number) => {
    logger.info(`Process id: ${process.pid} exited with ${code}`);

    await databaseService.closeConnection();
  });
})();

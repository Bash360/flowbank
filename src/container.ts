import { asClass, asValue, createContainer, Lifetime } from 'awilix';
import Utils from './common/helpers/utils';
import env from './config/env.config';
import logger from './config/logger';
import { DatabaseService } from './database/database.service';

const container = createContainer();

container.register({
  databaseService: asClass(DatabaseService).singleton(),
  config: asValue(env),
  logger: asValue(logger),
  utils: asValue(Utils),
});
const utils = container.resolve('utils');
const config = container.resolve('config');
const { basePath, fileExtension } = utils.getNodeEnvPath(config.NODE_ENV);
container.loadModules(
  [`${basePath}/modules/**/repositories/*.${fileExtension}`],
  {
    formatName: (name, descriptor) => {
      const parts = descriptor.path.split('/');
      const moduleIndex = parts.indexOf('modules') + 1;
      const moduleName = moduleIndex > 0 ? parts[moduleIndex] : 'unknown';

      return `${moduleName}Repository`;
    },
    resolverOptions: {
      lifetime: Lifetime.SINGLETON,
      register: asClass,
    },
  }
);

container.loadModules([`${basePath}/modules/**/services/*.${fileExtension}`], {
  formatName: (name, descriptor) => {
    const parts = descriptor.path.split('/');
    const moduleIndex = parts.indexOf('modules') + 1;
    const moduleName = moduleIndex > 0 ? parts[moduleIndex] : 'unknown';

    return `${moduleName}Service`;
  },
  resolverOptions: {
    lifetime: Lifetime.SCOPED,
    register: asClass,
  },
});

export default container;

import { createContainer, asClass, asFunction, asValue, Lifetime } from 'awilix'
import env from './config/env.config'
import logger from './config/logger'
import { DatabaseService } from './database/database.service'
import ExampleRepository from './modules/example/example.repository'
import ExampleService from './modules/example/example.service'

const container = createContainer()

container.register({
  databaseService: asClass(DatabaseService).singleton(),
  exampleRepository: asClass(ExampleRepository).singleton(),
  exampleService: asClass(ExampleService).scoped(),
  config: asValue(env),
  logger: asValue(logger),
})

container.loadModules(['modules/**/*.controller.ts'], {
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: 'SCOPED',
  },
})

export default container

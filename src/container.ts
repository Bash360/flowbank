import { createContainer, asClass, asFunction, asValue, Lifetime } from 'awilix'
import env from './config/env.config'
import logger from './config/logger'
import { DatabaseService } from './database/database.service'
import Utils from './common/helpers/utils'
import registerExampleModule from './modules/example/example.module'

const container = createContainer()

container.register({
  databaseService: asClass(DatabaseService).singleton(),
  config: asValue(env),
  logger: asValue(logger),
  utils: asValue(Utils),
})
registerExampleModule(container)
export default container

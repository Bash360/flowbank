import { asClass, Lifetime } from 'awilix'
import ExampleService from './services/example.service'
import ExampleRepository from './repositories/example.repository'

export default function registerExampleModule(container) {
  container.register({
    exampleService: asClass(ExampleService).scoped(),
    exampleRepository: asClass(ExampleRepository).scoped(),
  })
}

import { asClass, Lifetime } from 'awilix';
import ExampleService from './services/users.service';
import ExampleRepository from './repositories/users.repository';

export default function registerExampleModule(container) {
  container.register({
    exampleService: asClass(ExampleService).scoped(),
    exampleRepository: asClass(ExampleRepository).singleton(),
  });
}

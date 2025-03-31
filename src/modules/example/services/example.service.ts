import ExampleRepository from '../repositories/example.repository';
import { Example } from '../model/example.model';

class ExampleService {
  exampleRepository: ExampleRepository;
  constructor({ exampleRepository }: { exampleRepository: ExampleRepository }) {
    this.exampleRepository = exampleRepository;
  }

  async getExample(id: string): Promise<Example> {
    return this.exampleRepository.findById(id);
  }
}

export default ExampleService;

import ExampleModel, { Example } from '../model/example.model'
import BaseRepository from '../../../common/base/base.repository'
import { DatabaseService } from '../../../database/database.service'

class ExampleRepository extends BaseRepository<Example> {
  constructor(dbService: DatabaseService) {
    super(ExampleModel, dbService)
  }
}

export default ExampleRepository

import UserModel, { User } from '../models/users.model';
import BaseRepository from '../../../common/base/base.repository';
import { DatabaseService } from '../../../database/database.service';

class UsersRepository extends BaseRepository<User> {
  constructor() {
    super(UserModel);
  }
}

export default UsersRepository;

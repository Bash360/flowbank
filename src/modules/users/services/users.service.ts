import { User } from '../models/users.model';
import UsersRepository from '../repositories/users.repository';

class UsersService {
  usersRepository: UsersRepository;
  constructor({ usersRepository }: { usersRepository: UsersRepository }) {
    this.usersRepository = usersRepository;
  }

  async getUsers(id: string): Promise<User> {
    return this.usersRepository.findById(id);
  }
}

export default UsersService;

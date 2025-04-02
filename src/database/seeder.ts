import bcrypt from 'bcrypt';
import container from '../container';
import AccountsRepository from '../modules/accounts/repositories/accounts.repository';
import Currency from '../modules/accounts/types/currency.enum';
import UsersRepository from '../modules/users/repositories/users.repository';

const seedDatabase = async () => {
  const logger = container.resolve('logger');
  try {
    const config = container.resolve('config');

    const accountsRepository: AccountsRepository =
      container.resolve('accountsRepository');
    const usersRepository: UsersRepository =
      container.resolve('usersRepository');
    const email = config.ADMIN_EMAIL;
    let existingUser = await usersRepository.findBy('email', email);

    if (!existingUser) {
      await usersRepository.create({
        email,
        name: 'admin user',
        password: await bcrypt.hash(config.ADMIN_PASSWORD, 10),
      });
      existingUser = await usersRepository.findBy('email', email);
    }

    const existingAccounts = await accountsRepository.findByAll(
      'user',
      existingUser.id
    );

    if (existingAccounts.length === 2) {
      logger.info('seeding not required');
      return;
    }

    await accountsRepository.create({
      user: existingUser.id,
      currency: Currency.NGN,
      balance: 10_000_000_000,
    });

    await accountsRepository.create({
      user: existingUser.id,
      currency: Currency.USD,
      balance: 1_000_000_000,
    });

    logger.info('Seeding complete.');
    return;
  } catch (error) {
    logger.error('Seeding error:', error);
    process.exit(1);
  }
};

export default seedDatabase;

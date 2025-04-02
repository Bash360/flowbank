import mongoose from 'mongoose';
import { Account } from '../../src/modules/accounts/models/accounts.model';
import AccountsRepository from '../../src/modules/accounts/repositories/accounts.repository';
import AccountsService from '../../src/modules/accounts/services/accounts.service';
import Currency from '../../src/modules/accounts/types/currency.enum';

const mockAccountsRepository = {
  findOneByFields: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByAll: jest.fn(),
};
const mockLogger = { info: jest.fn(), error: jest.fn() };

const accountsService = new AccountsService({
  accountsRepository: mockAccountsRepository as unknown as AccountsRepository,
  logger: mockLogger as any,
});

describe('AccountsService', () => {
  const userId = new mongoose.Types.ObjectId();
  const accountId = new mongoose.Types.ObjectId();
  const account: Account = {
    _id: accountId,
    user: userId,
    currency: Currency.USD,
    balance: 1000,
  } as Account;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    it('should create a new account if it does not exist', async () => {
      mockAccountsRepository.findOneByFields.mockResolvedValue(null);
      mockAccountsRepository.create.mockResolvedValue(account);

      const result = await accountsService.createAccount(userId, Currency.USD);

      expect(mockAccountsRepository.findOneByFields).toHaveBeenCalledWith({
        user: userId,
        currency: Currency.USD,
      });
      expect(mockAccountsRepository.create).toHaveBeenCalledWith({
        user: userId,
        currency: Currency.USD,
      });
      expect(result).toEqual(account);
    });

    it('should throw an error if an account with the same currency exists', async () => {
      mockAccountsRepository.findOneByFields.mockResolvedValue(account);

      await expect(
        accountsService.createAccount(userId, Currency.USD)
      ).rejects.toThrow('Can not have multiple accounts of the same currency');
    });
  });

  describe('getAccount', () => {
    it('should return an account by ID', async () => {
      mockAccountsRepository.findById.mockResolvedValue(account);

      const result = await accountsService.getAccount(accountId);

      expect(mockAccountsRepository.findById).toHaveBeenCalledWith(accountId);
      expect(result).toEqual(account);
    });
  });

  describe('getAccounts', () => {
    it('should return all accounts for a user', async () => {
      mockAccountsRepository.findByAll.mockResolvedValue([account]);

      const result = await accountsService.getAccounts(userId);

      expect(mockAccountsRepository.findByAll).toHaveBeenCalledWith(
        'user',
        userId
      );
      expect(result).toEqual([account]);
    });
  });

  describe('getAccountByCurrency', () => {
    it('should return an account by currency', async () => {
      mockAccountsRepository.findOneByFields.mockResolvedValue(account);

      const result = await accountsService.getAccountByCurrency(
        userId,
        Currency.USD
      );

      expect(mockAccountsRepository.findOneByFields).toHaveBeenCalledWith({
        user: userId,
        currency: Currency.USD,
      });
      expect(result).toEqual(account);
    });

    it('should throw an error if account does not exist', async () => {
      mockAccountsRepository.findOneByFields.mockResolvedValue(null);

      await expect(
        accountsService.getAccountByCurrency(userId, Currency.USD)
      ).rejects.toThrow('Account for this currency does not exist');
    });
  });
});

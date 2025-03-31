import { ClientSession, FilterQuery, Model } from 'mongoose';
import { DatabaseService } from '../../database/database.service';
import BaseModel from './base.model';

abstract class BaseRepository<T extends BaseModel> {
  protected model: Model<T>;

  constructor(
    model: Model<T>,
    private readonly dbService: DatabaseService
  ) {
    this.model = model;
  }

  async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async startTransaction() {
    const session = await this.dbService.getConnection().startSession();
    session.startTransaction();
    return session;
  }
  async commitTransaction(session: ClientSession) {
    await session.commitTransaction();
    session.endSession();
  }

  async abortTransaction(session: ClientSession) {
    await session.abortTransaction();
    session.endSession();
  }

  async findBy<K extends keyof T>(key: K, value: T[K]): Promise<T | null> {
    const query = { [key]: value } as FilterQuery<T>;
    return this.model.findOne(query).exec();
  }
}

export default BaseRepository;

import mongoose, { ClientSession, FilterQuery, Model } from 'mongoose';
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

  async findAll(session?: ClientSession): Promise<T[]> {
    return await this.model.find().session(session || null);
  }

  async findById(
    id: mongoose.Types.ObjectId,
    session?: ClientSession
  ): Promise<T | null> {
    return await this.model.findById(id).session(session || null);
  }

  async create(data: Partial<T>, session?: ClientSession): Promise<T> {
    return await this.model
      .create([{ ...data }], { session })
      .then((res) => res[0]);
  }

  async update(
    id: string,
    data: Partial<T>,
    session?: ClientSession
  ): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true, session });
  }

  async delete(
    id: mongoose.Types.ObjectId,
    session?: ClientSession
  ): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).session(session || null);
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

  async findBy<K extends keyof T>(
    key: K,
    value: T[K],
    session?: ClientSession
  ): Promise<T | null> {
    const query = { [key]: value } as FilterQuery<T>;
    return this.model
      .findOne(query)
      .session(session || null)
      .exec();
  }

  async findByAll<K extends keyof T>(
    key: K,
    value: T[K],
    session?: ClientSession
  ): Promise<T[]> {
    const query = { [key]: value } as FilterQuery<T>;
    return this.model
      .find(query)
      .session(session || null)
      .exec();
  }

  async findByFields(
    fields: Partial<T>,
    session?: ClientSession
  ): Promise<T[]> {
    return this.model
      .find(fields as FilterQuery<T>)
      .session(session || null)
      .exec();
  }

  async findOneByFields(
    fields: Partial<T>,
    session?: ClientSession
  ): Promise<T | null> {
    return this.model
      .findOne(fields as FilterQuery<T>)
      .session(session || null)
      .exec();
  }
}

export default BaseRepository;

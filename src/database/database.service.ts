import mongoose, { Connection, ConnectOptions } from 'mongoose';
import { Logger } from 'winston';

export class DatabaseService {
  private connection!: Connection;
  private readonly logger: Logger;
  private readonly config: any;
  constructor({ logger, config }: { logger: Logger; config: any }) {
    this.logger = logger;
    this.config = config;
  }

  async connect() {
    if (this.connection) {
      this.logger.info('Using existing MongoDB connection...');
      return;
    }
    const options: ConnectOptions = {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    } as ConnectOptions;
    try {
      const db = await mongoose.connect(this.config.DB_URI, options);
      this.connection = db.connection;
      this.logger.info(`MongoDB Connected ${process.pid}`);
    } catch (error) {
      this.logger.error('Database connection failed: ', error);
      throw new Error(`Database connection failed ${error}`);
    }
  }

  getConnection(): Connection {
    if (!this.connection) {
      this.logger.error('DataBase not connecting');
      throw new Error(`database not connected on worker ${process.pid}`);
    }
    return this.connection;
  }

  async closeConnection() {
    try {
      if (this.connection) {
        await this.connection.close();
        this.logger.info('Db connection closed');
        return;
      }
      this.logger.warn('Db is not open');
    } catch (error) {
      this.logger.error('Database connection failed: ', error);
      throw new Error('Database connection failed');
    }
  }
}

import mongoose, { Connection, ConnectOptions } from 'mongoose';
import { Logger } from 'winston';

export class DatabaseService {
  private connection!: Connection;
  private logger: Logger;
  private config: any;
  constructor({ logger, config }: { logger: Logger; config: any }) {
    this.logger = logger;
    this.config = config;
  }

  async connect() {
    const options: ConnectOptions = {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    } as ConnectOptions;
    const db = await mongoose.connect(this.config.DB_URI, options);
    this.connection = db.connection;
    this.logger.info('MongoDB Connected with Connection Pooling...');
  }

  getConnection(): Connection {
    if (!this.connection) {
      this.logger.error('DataBase not connecting');
      throw new Error('Database not connected');
    }
    return this.connection;
  }
}

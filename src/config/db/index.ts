import config from 'config';
import { DBConfig } from '../../shared/interfaces/config.interface';
import DBsEnum from './dbs.enums';
import PostgresDataBase from './Postgres.db';
import MongooseDataBase from './Mongoose.db';

export default class DataBase {
  private db: DBsEnum;
  private dbConfigs: DBConfig;

  constructor(db: DBsEnum) {
    this.db = db;
    // load the DB connection configs
    const dbConfigs: DBConfig = config.get('db');
    this.dbConfigs = dbConfigs;
  }

  connectDB = async (): Promise<boolean> => {
    switch (this.db) {
      case DBsEnum.Postgres:
        return this.postgresConnect();
      case DBsEnum.Mongoose:
        return this.mongooseConnect();
      default:
        return false;
    }
  };

  postgresConnect = async (): Promise<boolean> => {
    const postgres = new PostgresDataBase();
    postgres.config(this.dbConfigs);
    const connected = await postgres.connectDB();
    return connected;
  };

  mongooseConnect = async (): Promise<boolean> => {
    const mongoose = new MongooseDataBase();
    mongoose.config(this.dbConfigs);
    const connected = await mongoose.connectDB();
    return connected;
  };
}

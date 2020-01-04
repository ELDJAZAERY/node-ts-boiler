import mongoose, { Mongoose } from 'mongoose';
import { DBConfig } from '../../shared/interfaces/config.interface';
import DataBaseInterface from './db.interface';

export default class MongooseDataBase implements DataBaseInterface {
  private host: string;
  private name: string;

  config(dbConfig: DBConfig) {
    this.host = dbConfig.host;
    this.name = dbConfig.name;
  }

  async connectDB(): Promise<boolean> {
    try {
      await mongoose.connect(`mongodb://${this.host}/${this.name}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      });
      this.success();
      return true;
    } catch (err) {
      this.issue(err);
      return false;
    }
  }

  success(): void {
    console.log(
      `#### Successfully connected to mongodb://${this.host}/${this.name} ####`
    );
  }

  issue(err: string): void {
    console.log(
      `#### Failed to connecte to mongodb://${this.host}/${this.name} ####`
    );
    console.log(`${err}`);
  }
}

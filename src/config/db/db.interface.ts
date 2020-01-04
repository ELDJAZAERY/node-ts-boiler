import { DBConfig } from '../../shared/interfaces/config.interface';

export default interface DataBaseInterface {
  config(dbConfig: DBConfig): void;
  connectDB(dbConfig: DBConfig): Promise<boolean>;
  success(): void;
  issue(err: string): void;
}

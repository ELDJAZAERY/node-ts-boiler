import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from 'typeorm';
import { Client } from '../../user';

@Entity({ name: 'group' })
export default class Group extends BaseEntity {
  static readonly TABLE_NAME = 'group';

  @PrimaryGeneratedColumn('uuid')
  id: String;

  @ManyToOne(
    type => Client,
    client => client.groups
  )
  client: Client;

  @Column({ type: 'varchar' })
  name: String;

  @Column({ name: 'trade_register', type: 'varchar' })
  tradeRegister: String;

  @Column()
  category: string;

  @Column({ name: 'is_actif', type: 'boolean' })
  isActive: boolean;

  presave() {
    this.name = 'name';
    this.tradeRegister = 'trade';
    this.category = 'categ';
    this.isActive = false;
  }
}

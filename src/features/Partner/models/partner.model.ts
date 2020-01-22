import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Client } from '../../user';
import CreatePartnerDTO from '../dto/create.partner.dto';
import Request from '../../request/models/request.model';
import Key from '../../keys/models/keys.model';

@Entity({ name: 'client' })
export default class Partner extends BaseEntity {
  static readonly TABLE_NAME = 'client';

  @PrimaryGeneratedColumn('uuid')
  id: String;

  @Index({ unique: true })
  @Column({ name: 'trade_register', type: 'varchar', unique: true })
  tradeRegister: String;

  @Column({ type: 'varchar' })
  name: String;

  @Column()
  category: string;

  @Column({ name: 'is_actif', type: 'boolean' })
  isActive: boolean;

  @OneToMany(
    type => Client,
    client => client.partner
  )
  clients: Client[];

  @OneToMany(
    type => Request,
    request => request.partner
  )
  requests: Request[];

  @OneToMany(
    type => Key,
    key => key.partner
  )
  keys: Key[];

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  presave(createPartnerDTO: CreatePartnerDTO) {
    const { name, tradeRegister, category, isActive } = createPartnerDTO;
    this.name = name;
    this.tradeRegister = tradeRegister;
    this.category = category;
    this.isActive = isActive;
  }

  normalize(): Partner {
    delete this.id;
    delete this.save;
    delete this.normalize;
    return this;
  }
}
